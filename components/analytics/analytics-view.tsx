"use client"
import { formatCurrency } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Target } from "lucide-react"
import { TradeMentor } from "./trade-mentor"
import { useRouter, useSearchParams } from "next/navigation"

interface AnalyticsViewProps {
    accounts: { id: string; name: string }[]
    stats: any // Typed loosely here, but matches getDashboardStats return
}

export default function AnalyticsView({ accounts, stats }: AnalyticsViewProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentAccountId = searchParams.get("accountId") || "all"

    const handleAccountChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === "all") {
            params.delete("accountId")
        } else {
            params.set("accountId", value)
        }
        router.push(`/analytics?${params.toString()}`)
    }

    if (!stats) {
        return <div className="p-6">Loading stats...</div>
    }

    return (
        <section className="p-6 bg-background/50 min-h-full space-y-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Trading Analytics</h1>
                        <p className="text-muted-foreground">Detailed insights into your trading performance</p>
                    </div>
                    <div className="w-[200px]">
                        <Select value={currentAccountId} onValueChange={handleAccountChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Accounts</SelectItem>
                                {accounts.map(acc => (
                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Portfolio Return / Net Profit */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                                    <h3 className={`text-2xl font-bold mt-1 ${stats.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {formatCurrency(stats.netProfit)}
                                    </h3>
                                </div>
                                <div className={`p-2 rounded-lg ${stats.netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>Total commission: {formatCurrency(stats.totalCommission)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profit Factor */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Profit Factor</p>
                                    <h3 className="text-2xl font-bold text-foreground mt-1">{stats.profitFactor}</h3>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{stats.winRate} Win Rate</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sharpe Ratio (Replaced Avg Hold Time) */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                                    <h3 className="text-2xl font-bold text-foreground mt-1">{stats.sharpeRatio}</h3>
                                </div>
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Risk Metric</p>
                        </CardContent>
                    </Card>

                    {/* Max Drawdown */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                                    <h3 className="text-2xl font-bold text-foreground mt-1 text-red-500">{stats.maxDrawdown}%</h3>
                                </div>
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                    <ArrowDownRight className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground"> Peak-to-Valley</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Trade Mentor (Replaced Cumulative P&L Placeholder) */}
                    <TradeMentor stats={stats} />

                    {/* Stats Distribution */}
                    <div className="space-y-6">
                        <Card className="border-border bg-card shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Win/Loss Ratio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-500"
                                            style={{ width: `${Math.min(stats.winRateValue, 100)}%` }}
                                        ></div>
                                        <div
                                            className="h-full bg-red-500 transition-all duration-500"
                                            style={{ width: `${Math.max(0, 100 - stats.winRateValue)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Win ({stats.wins})</span>
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Loss ({stats.losses})</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Trading Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Avg Net Profit</span>
                                    <span className="font-semibold text-foreground">
                                        {stats.totalTransactions > 0 ? formatCurrency(stats.netProfit / stats.totalTransactions) : formatCurrency(0)}
                                    </span>
                                </div>
                                <div className="w-full h-px bg-border"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Avg Risk:Reward</span>
                                    <span className="font-semibold text-foreground">
                                        {stats.avgRiskReward !== "∞" ? `${stats.avgRiskReward}RR` : "∞"}
                                    </span>
                                </div>
                                <div className="w-full h-px bg-border"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total Trades</span>
                                    <span className="font-semibold text-foreground">{stats.totalTransactions}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Performance by Symbol - Keeping this static or loosely coupled for now as per minimal change requirement unless stats support it. 
                    stats doesn't have symbol data yet in getDashboardStats. 
                    I'll comment it out or leave it static placeholder if data not present, 
                    OR remove it to clean up if not requested.
                    User request: "First, replace Avg Hold Time... Cumulative P&L transformed into Trade Mentor."
                    I will remove the static table to avoid confusion, or keep it static? 
                    Better to hide misleading static data.
                */}
            </div>
        </section >
    )
}
