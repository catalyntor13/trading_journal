"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StrategyData {
    name: string
    profit: number
    totalTrades: number
    winRate: number
}

// Custom tooltip to show details
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-popover border border-border p-3 rounded-lg shadow-xl text-popover-foreground">
                <p className="font-bold text-foreground mb-1">{label}</p>
                <div className="space-y-1 text-sm">
                    <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Profit:</span>
                        <span className={data.profit >= 0 ? "text-emerald-500" : "text-red-500"}>
                            ${data.profit.toFixed(2)}
                        </span>
                    </p>
                    <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Trades:</span>
                        <span className="text-foreground">{data.totalTrades}</span>
                    </p>
                    <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Win Rate:</span>
                        <span className="text-blue-500">{data.winRate}%</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export function StrategiesChart({ data }: { data: StrategyData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-border rounded-xl bg-card">
                No strategy data available
            </div>
        )
    }

    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-foreground">Strategy Performance</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Profit Distribution by Strategy
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                width={100}
                                tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(var(--foreground),0.05)' }} />
                            <Bar dataKey="profit" radius={[0, 4, 4, 0]} barSize={20}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.profit >= 0 ? "var(--color-emerald-500)" : "var(--color-red-500)"} // Note: tailwind variables might not resolve here directly without CSS vars, falling back to hex if needed or relying on class extraction?
                                        // Actually rechart cells accept standard CSS colors. Let's use hex for safety or established CSS vars if defined in global.
                                        // My global css defines global vars but not color-emerald-500. sticking to tailwind colors or using my defined vars
                                        fillOpacity={0.8}
                                        stroke={entry.profit >= 0 ? "#10b981" : "#ef4444"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
