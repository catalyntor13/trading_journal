"use client"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { BarChart3, TrendingUp, Brain, Target } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface DashboardStats {
    winRate: string
    netProfit: number
    totalTransactions: number
    tpCount?: number
    slCount?: number
    beCount?: number
    bestStrategy?: string
    dominantEmotion?: string
    averageFearIndex?: string
}

export function TradingPerformanceCard({ stats }: { stats: DashboardStats }) {
    // If we don't have the new stats yet (e.g. older cached data?), fallback safely
    const tpCount = stats.tpCount || 0
    const slCount = stats.slCount || 0
    const beCount = stats.beCount || 0
    const total = stats.totalTransactions || 0
    const bestStrategy = stats.bestStrategy || "N/A"


    const chartData = [
        { label: "Wins", count: tpCount, fill: "var(--color-wins)" },
        { label: "Losses", count: slCount, fill: "var(--color-losses)" },
        { label: "BE", count: beCount, fill: "var(--color-be)" },
    ]

    const chartConfig = {
        count: {
            label: "Count",
        },
        wins: {
            label: "Wins",
            color: "#10b981", // Emerald-500
        },
        losses: {
            label: "Losses",
            color: "#ef4444", // Red-500
        },
        be: {
            label: "BE",
            color: "#eab308", // Yellow-500
        },
    } satisfies ChartConfig

    return (
        <Card className="border-border bg-card text-foreground h-full shadow-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Overall Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">

                {/* Top Metrics Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Trades</p>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-xl font-bold">{total}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Best Strategy</p>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold truncate max-w-[200px]" title={bestStrategy}>
                                {bestStrategy}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Avg Fear Index</p>
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-500" />
                            <span className="text-xl font-bold">
                                {stats.averageFearIndex || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Bar Chart for Trading Stats */}
                <Card className="shadow-none border-none mt-2">
                    <ChartContainer config={chartConfig} className="h-[140px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                left: 10,
                                top: 0,
                                bottom: 0,
                                right: 20
                            }}
                            barSize={26}
                        >
                            <YAxis
                                dataKey="label"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={65}
                            />
                            <XAxis dataKey="count" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="count" layout="vertical" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </Card>

            </CardContent>
        </Card>
    )
}
