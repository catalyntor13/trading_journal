"use client"

import { AlertCircleIcon, CheckIcon, TrendingDownIcon, TrendingUpIcon, Activity, Wallet, Percent, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardStats {
    totalBalance: number
    winRate: string
    profitFactor: string
    netProfit: number
    wins: number
    losses: number
    totalTransactions: number
    totalCommission: number
}

const ArenaStats = ({ stats }: { stats: DashboardStats }) => {
    // Determine status color/icon based on values
    const netProfitColor = stats.netProfit >= 0 ? "text-emerald-500" : "text-red-500"

    return (
        <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Balance Card */}
                <Card className="bg-[#161b26] border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            ${stats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                            Current Equity
                        </p>
                    </CardContent>
                </Card>

                {/* Net Profit Card */}
                <Card className="bg-[#161b26] border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Net Profit</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfitColor}`}>
                            ${stats.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                            After commission: ${stats.totalCommission.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                {/* Win Rate Card */}
                <Card className="bg-[#161b26] border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Win Rate</CardTitle>
                        <Percent className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.winRate}</div>
                        <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-orange-500"
                                style={{ width: stats.winRate }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Commission/Costs Card (Requested by user) */}
                <Card className="bg-[#161b26] border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Commissions</CardTitle>
                        <TrendingDownIcon className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">
                            -${stats.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                            Total trading fees paid
                        </p>
                    </CardContent>
                </Card>

                {/* Profit Factor - Optional, maybe move to secondary or keep. User asked for Balance & Commission "back". 
                    If they replace existing ones, I should probably keep PF somewhere?
                    User said "In the dashboard you must add back the card with the current account balance and commision card". 
                    I'll add them as I did, keeping 4 columns grid is nice.
                */}
            </div>
        </section>
    )
}

export default ArenaStats