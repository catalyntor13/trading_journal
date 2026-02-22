"use server"

import { db } from "@/db"
import { strategies, TradingAccountsData, trading_accounts } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { StrategyFormValues } from "@/lib/schemas"

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    })
}

export async function createStrategy(data: StrategyFormValues) {
    const session = await getSession() // this is placeholder
    if (!session) {
        return { error: "Unauthorized" }
    }

    try {
        await db.insert(strategies).values({
            id: crypto.randomUUID(),
            name: data.name,
            description: data.description,
            userId: session.user.id
        })
        revalidatePath("/strategies")
        return { success: true }
    } catch (error) {
        return { error: "Failed to create strategy" }
    }
}


export async function getStrategies() {
    const session = await getSession()
    if (!session) return []

    // 1. Fetch user strategies
    const userStrategies = await db.select().from(strategies)
        .where(eq(strategies.userId, session.user.id))
        .orderBy(desc(strategies.name))

    // 2. Fetch all user trades to calculate stats
    // We need to join with trading_accounts to ensure we only get trades for this user
    const userTrades = await db.select({
        strategyId: TradingAccountsData.strategy,
        profit: TradingAccountsData.profit,
        commission: TradingAccountsData.commission,
        // We might need outcome/direction to determine win/loss accurately if profit isn't enough, 
        // but typically profit > 0 is win.
    })
        .from(TradingAccountsData)
        .innerJoin(trading_accounts, eq(TradingAccountsData.accountId, trading_accounts.id))
        .where(eq(trading_accounts.userId, session.user.id))

    // 3. Calculate stats per strategy
    const strategiesWithStats = userStrategies.map(strategy => {
        // Filter trades for this strategy. 
        // Trade.strategy stores the Strategy Name (based on AddTradeForm), not ID.
        const strategyTrades = userTrades.filter(t => t.strategyId === strategy.name)

        let wins = 0
        let totalProfit = 0

        strategyTrades.forEach(t => {
            const p = parseFloat(t.profit || "0")
            const c = parseFloat(t.commission || "0")
            const net = p - c

            totalProfit += net
            if (net > 0) wins++
        })

        const totalTrades = strategyTrades.length
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0

        return {
            ...strategy,
            winRate: parseFloat(winRate.toFixed(1)),
            profit: parseFloat(totalProfit.toFixed(2)),
            totalTrades
        }
    })

    return strategiesWithStats
}

export async function deleteStrategy(id: string) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.delete(strategies).where(eq(strategies.id, id))
        revalidatePath("/strategies")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete strategy" }
    }
}
