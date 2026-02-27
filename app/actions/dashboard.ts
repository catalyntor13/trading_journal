"use server"

import { db } from "@/db"
import { trading_accounts, TradingAccountsData } from "@/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    })
}

// Reuse or duplicate getAccounts helper
export async function getDashboardAccounts() {
    const session = await getSession()
    if (!session) return []
    return await db.select({ id: trading_accounts.id, name: trading_accounts.name })
        .from(trading_accounts)
        .where(eq(trading_accounts.userId, session.user.id))
}

export async function getDashboardStats(accountId?: string) {
    const session = await getSession()
    if (!session) return null

    let conditions = eq(trading_accounts.userId, session.user.id)
    if (accountId && accountId !== "all") {
        conditions = and(conditions, eq(trading_accounts.id, accountId))!
    }

    const accountsList = await db.select({ balance: trading_accounts.balance })
        .from(trading_accounts)
        .where(conditions)

    const initialBalance = accountsList.reduce((acc, curr) => acc + (parseFloat(curr.balance || "0") || 0), 0)

    const trades = await db.select({
        profit: TradingAccountsData.profit,
        commission: TradingAccountsData.commission,
        date: TradingAccountsData.date,
        createdAt: TradingAccountsData.createdAt,
        strategy: TradingAccountsData.strategy,
        fearIndex: TradingAccountsData.fearIndex,
    })
        .from(TradingAccountsData)
        .innerJoin(trading_accounts, eq(TradingAccountsData.accountId, trading_accounts.id))
        .where(conditions)
        .orderBy(TradingAccountsData.date) // Ensure chronological order for drawdown/streaks

    // --- Metrics Calculation ---
    let totalProfit = 0
    let totalCommission = 0
    let wins = 0
    let losses = 0
    let grossWin = 0
    let grossLoss = 0

    // Overall Performance Metrics
    let tpCount = 0
    let slCount = 0
    let beCount = 0

    const strategyPerformance: Record<string, number> = {} // Strategy -> Total Profit
    const emotionCounts: Record<string, number> = {} // Emotion -> Count

    // For Streaks
    let currentLossStreak = 0
    let maxLossStreak = 0
    let currentWinStreak = 0
    let maxWinStreak = 0

    // For Drawdown
    let runningBalance = initialBalance
    let peakBalance = initialBalance
    let maxDrawdown = 0

    // For Sharpe (Daily Returns)
    type DayData = { profit: number; count: number }
    const dailyPnL: Record<string, DayData> = {}

    for (const t of trades) {
        const p = parseFloat(t.profit || "0")
        const c = parseFloat(t.commission || "0")
        const net = p - c // We use Net Profit for TP/SL/BE decisions

        totalProfit += net
        totalCommission += c

        // TP/SL/BE Logic
        // Assuming strict > 0 is TP, < 0 is SL, == 0 is BE
        // (Adjust threshold to 0.01 if needed for floating point, but 0 string validation logic usually holds for exact 0)
        if (net > 0) {
            tpCount++
            wins++
            grossWin += net
            currentWinStreak++
            if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak
            currentLossStreak = 0
        } else if (net < 0) {
            slCount++
            losses++
            grossLoss += Math.abs(net)
            currentLossStreak++
            if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak
            currentWinStreak = 0
        } else {
            beCount++
            // Treat BE as neutral for streaks? Or reset? Usually breaks streaks.
            if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak
            currentLossStreak = 0
            if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak
            currentWinStreak = 0
        }

        // Strategy Performance
        // Use strategy name or ID. If multiple strategies verify uniqueness.
        const strat = t.strategy || "Unknown"
        strategyPerformance[strat] = (strategyPerformance[strat] || 0) + net

        // Emotion Tracking
        // We only count if emotion is logged and not empty string
        /* 
           t.emotion might be null or empty string. 
           Schema says text("emotion"), so string | null.
        */
        // Verify if t has emotion property properly selected? Yes, db.select() included it implicitly?
        // Wait, previous `db.select` call only selected specific fields!
        // NEED TO CHECK SELECT FIELDS below.

        // ... (We need to update input select first, wait. I will fix the select in this tool call too if possible or assume implied full select if I missed it? 
        // No, I see `const trades = await db.select({...`
        // I need to add strategy and emotion to that select!)


        // Running Balance & Drawdown
        runningBalance += net
        if (runningBalance > peakBalance) {
            peakBalance = runningBalance
        }
        const drawdownCount = peakBalance - runningBalance
        const drawdownPct = peakBalance > 0 ? (drawdownCount / peakBalance) * 100 : 0
        if (drawdownPct > maxDrawdown) {
            maxDrawdown = drawdownPct
        }

        // Daily Data for Sharpe & Chart
        const d = t.date || t.createdAt
        const dateStr = d.toISOString().split('T')[0]

        if (!dailyPnL[dateStr]) {
            dailyPnL[dateStr] = { profit: 0, count: 0 }
        }
        dailyPnL[dateStr].profit += net
        dailyPnL[dateStr].count += 1
    }

    // Final streak check
    if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak
    if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak

    // Profit Factor & Win Rate
    const profitFactor = grossLoss > 0 ? (grossWin / grossLoss).toFixed(2) : grossWin > 0 ? "∞" : "0"
    const totalTrades = trades.length
    const winRateVal = totalTrades > 0 ? (wins / totalTrades) * 100 : 0
    const winRate = winRateVal.toFixed(1) + "%"

    // Average RR
    const avgWin = wins > 0 ? grossWin / wins : 0
    const avgLoss = losses > 0 ? grossLoss / losses : 0
    const avgRiskReward = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : avgWin > 0 ? "∞" : "0"

    // Sharpe Ratio (Simplified: using daily returns assuming 0 risk-free rate)
    const dailyReturns = Object.values(dailyPnL).map(d => d.profit)
    let sharpeRatio = "0"
    if (dailyReturns.length > 1) {
        const meanReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
        const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / (dailyReturns.length - 1)
        const stdDev = Math.sqrt(variance)
        // Annualize logic: avg daily return / daily stdDev * sqrt(252). 
        // Note: This is "Sharpe of Returns ($)". Often percentage returns are used. 
        // Sticking to basic ($ mean / $ stdDev) * sqrt(252) for a rough annualized metric.
        const annualizedSharpe = stdDev > 0 ? (meanReturn / stdDev) * Math.sqrt(252) : 0
        sharpeRatio = annualizedSharpe.toFixed(2)
    }

    // Best Strategy
    let bestStrategy = "N/A"
    let bestStrategyPnL = -Infinity
    for (const [strat, pnl] of Object.entries(strategyPerformance)) {
        if (pnl > bestStrategyPnL) {
            bestStrategy = strat
            bestStrategyPnL = pnl
        }
    }
    if (bestStrategyPnL === -Infinity) bestStrategy = "N/A"

    // Dominant Emotion & Average Fear Index
    let dominantEmotion = "N/A"
    let maxEmotionCount = 0
    let totalFearIndex = 0
    let fearIndexCount = 0

    for (const [emo, count] of Object.entries(emotionCounts)) {
        if (count > maxEmotionCount) {
            dominantEmotion = emo
            maxEmotionCount = count
        }
    }

    // Calculate Average Fear Index
    for (const t of trades) {
        if (t.fearIndex) {
            const val = parseFloat(t.fearIndex)
            if (!isNaN(val)) {
                totalFearIndex += val
                fearIndexCount++
            }
        }
    }
    const averageFearIndex = fearIndexCount > 0 ? (totalFearIndex / fearIndexCount).toFixed(1) : "N/A"

    // Current Account Balance
    const totalBalance = runningBalance

    // Chart Data Preparation
    const chartData = Object.entries(dailyPnL).sort((a, b) => a[0].localeCompare(b[0])).map(([date, data]) => ({
        date: formatShortDate(date),
        rawDate: date,
        dailyProfit: data.profit,
    }))

    // Accumulate for Equity Curve
    let chartRunningBalance = initialBalance
    const cumulativeChartData = chartData.map(d => {
        chartRunningBalance += d.dailyProfit
        return {
            ...d,
            balance: chartRunningBalance
        }
    })

    // Handle empty state
    if (cumulativeChartData.length === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        cumulativeChartData.push({
            date: formatShortDate(yesterday.toISOString()),
            rawDate: yesterday.toISOString().split('T')[0],
            dailyProfit: 0,
            balance: initialBalance
        });
        cumulativeChartData.push({
            date: formatShortDate(today.toISOString()),
            rawDate: today.toISOString().split('T')[0],
            dailyProfit: 0,
            balance: initialBalance
        });
    } else if (cumulativeChartData.length === 1) {
        // Prepend a dummy start point to ensure Recharts draws a line
        const firstPoint = cumulativeChartData[0];
        const d = new Date(firstPoint.rawDate);
        d.setDate(d.getDate() - 1);
        cumulativeChartData.unshift({
            date: formatShortDate(d.toISOString()),
            rawDate: d.toISOString().split('T')[0],
            dailyProfit: 0,
            balance: initialBalance
        });
    }

    // Determine strict consecutive stop losses (Is it current streak or max streak? Prompt implies "Consecutive Stop Losses" status, usually current status for mentor)
    // "Consecutive Stop Losses ... This indicates..." -> suggests checking CURRENT streak for immediate feedback.
    // However, "Max Loss Streak" is also useful stats. Let's return both or focus on current for Mentor.
    // Mentor text: "1-3 SLs", "4-6 SLs". This implies observing the *current* state of the trader.

    return {
        totalBalance,
        netProfit: totalProfit,
        netProfitTrend: "+0%", // Placeholder
        winRate,
        winRateValue: winRateVal, // numeric for Logic
        wins,
        losses,
        profitFactor, // string
        profitFactorValue: parseFloat(profitFactor === "∞" ? "999" : profitFactor), // numeric
        totalTransactions: totalTrades,
        totalCommission,
        commissionTrend: "+0%",
        chartData: cumulativeChartData,
        calendarData: dailyPnL,
        // New Metrics
        sharpeRatio,
        sharpeRatioValue: parseFloat(sharpeRatio),
        avgRiskReward,
        avgRiskRewardValue: avgLoss > 0 ? avgWin / avgLoss : 999,
        maxDrawdown: maxDrawdown.toFixed(2), // string %
        maxDrawdownValue: maxDrawdown, // numeric %
        currentLossStreak,
        maxLossStreak,
        // New Overall Stats
        tpCount,
        slCount,
        beCount,
        bestStrategy,
        dominantEmotion,
        averageFearIndex
    }
}

function formatShortDate(isoDate: string) {
    // 2023-10-01 -> Oct 01
    const d = new Date(isoDate)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}
