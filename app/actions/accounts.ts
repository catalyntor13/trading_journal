"use server"

import { db } from "@/db"
import { trading_accounts, TradingAccountsData } from "@/db/schema"
import { eq, desc, sql, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { AccountFormValues, TradeFormValues } from "@/lib/schemas"

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    })
}

// Schemas moved to lib/schemas.ts to avoid "use server" export error

// Account Actions
export async function getAccounts() {
    const session = await getSession()
    if (!session) return []

    const userAccounts = await db.select().from(trading_accounts)
        .where(eq(trading_accounts.userId, session.user.id))
        .orderBy(desc(trading_accounts.createdAt))

    if (userAccounts.length === 0) return []

    const accountIds = userAccounts.map(a => a.id)

    // Fetch trades to calculate P&L per account
    const trades = await db.select({
        accountId: TradingAccountsData.accountId,
        profit: TradingAccountsData.profit,
        commission: TradingAccountsData.commission
    })
        .from(TradingAccountsData)
        .where(inArray(TradingAccountsData.accountId, accountIds))

    // Aggregate P&L
    const pnlByAccount = trades.reduce((acc, t) => {
        const p = parseFloat(t.profit || "0")
        const c = parseFloat(t.commission || "0")
        acc[t.accountId] = (acc[t.accountId] || 0) + (p - c)
        return acc
    }, {} as Record<string, number>)

    // Return accounts with updated balance
    return userAccounts.map(account => {
        const initialBalance = parseFloat(account.balance || "0")
        const totalPnl = pnlByAccount[account.id] || 0
        const currentBalance = initialBalance + totalPnl

        return {
            ...account,
            initialBalance, // Pass initial balance for UI comparison
            balance: currentBalance.toFixed(2) // Update balance with real value
        }
    })
}

export async function getAccount(id: string) {
    const session = await getSession()
    if (!session) return null

    const res = await db.select().from(trading_accounts)
        .where(eq(trading_accounts.id, id))
        //.where(eq(trading_accounts.userId, session.user.id)) // Security check
        .limit(1)

    const account = res[0]
    if (!account) return null

    // Calculate dynamic balance from trades
    const trades = await db.select({
        profit: TradingAccountsData.profit,
        commission: TradingAccountsData.commission
    }).from(TradingAccountsData).where(eq(TradingAccountsData.accountId, id))

    const totalPnl = trades.reduce((acc, t) => {
        const p = parseFloat(t.profit || "0")
        const c = parseFloat(t.commission || "0")
        return acc + (p - c)
    }, 0)

    const initialBalance = parseFloat(account.balance || "0")
    const currentBalance = initialBalance + totalPnl

    return {
        ...account,
        initialBalance,
        balance: currentBalance.toFixed(2)
    }
}

export async function createAccount(data: AccountFormValues) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        const newAccountId = crypto.randomUUID()
        await db.insert(trading_accounts).values({
            id: newAccountId,
            userId: session.user.id,
            name: data.name,
            balance: data.balance || "0",
            type: data.type || "Live",
            broker: data.broker || "",
        })
        revalidatePath("/accounts")
        revalidatePath("/dashboard")
        return { success: true, id: newAccountId }
    } catch (e) {
        return { error: "Failed to create account" }
    }
}

export async function deleteAccount(id: string) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.delete(trading_accounts).where(eq(trading_accounts.id, id))
        revalidatePath("/accounts")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete account" }
    }
}

// Trade Actions
export async function getTrades(
    accountId: string,
    page: number = 1,
    limit: number = 10
) {
    const session = await getSession()
    if (!session) return { trades: [], totalCount: 0 }

    const offset = (page - 1) * limit

    const [trades, countResult] = await Promise.all([
        db.select()
            .from(TradingAccountsData)
            .where(eq(TradingAccountsData.accountId, accountId))
            .orderBy(desc(TradingAccountsData.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: sql<number>`count(*)` })
            .from(TradingAccountsData)
            .where(eq(TradingAccountsData.accountId, accountId))
    ])

    return {
        trades,
        totalCount: Number(countResult[0]?.count || 0)
    }
}

export async function addTrade(data: TradeFormValues) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.insert(TradingAccountsData).values({
            id: crypto.randomUUID(),
            accountId: data.accountId,
            pair: data.pair || "",
            strategy: data.strategy || "",
            direction: data.direction, // Buy/Sell
            profit: data.profit || "0",
            commission: data.commission || "0",
            riskPercent: data.riskPercent || "0",
            tod: data.tod || "",
            riskRatio: data.riskRatio || "",
            comments: data.comments || "",
            image1: data.image1 || "",
            image2: data.image2 || "",
            fearIndex: data.fearIndex || "",
            date: data.date // Insert date
        })
        revalidatePath(`/accounts/${data.accountId}`)
        return { success: true }
    } catch (e) {
        return { error: "Failed to add trade" }
    }
}

export async function deleteTrade(id: string, accountId: string) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.delete(TradingAccountsData).where(eq(TradingAccountsData.id, id))
        revalidatePath(`/accounts/${accountId}`)
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete trade" }
    }
}

export async function updateTrade(id: string, accountId: string, data: Partial<TradeFormValues>) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.update(TradingAccountsData).set({
            ...data
        }).where(eq(TradingAccountsData.id, id))
        revalidatePath(`/accounts/${accountId}`)
        return { success: true }
    } catch (e) {
        return { error: "Failed to update trade" }
    }
}
