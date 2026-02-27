"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


export function PortfolioChart({ data }: { data: { date: string; balance: number }[] }) {

  const start = data.length > 0 ? data[0].balance : 0
  const end = data.length > 0 ? data[data.length - 1].balance : 0
  const diff = end - start
  const percent = start !== 0 ? ((diff / Math.abs(start)) * 100).toFixed(1) : "0.0"

  const isProfit = diff >= 0;
  const lineColor = isProfit ? "#10b981" : "#ef4444"; // emerald-500 for profit, red-500 for loss

  const dynamicConfig = {
    balance: {
      label: "Balance",
      color: lineColor,
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-[#0A101C] border border-slate-800/60 rounded-2xl shadow-lg relative overflow-hidden group">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 blur-[80px] pointer-events-none transition-colors duration-1000 ${isProfit ? 'bg-emerald-500/10' : 'bg-red-500/10'}`} />

      <CardHeader className="relative z-10">
        <CardTitle className="text-white text-xl">Cumulative PnL</CardTitle>
        <CardDescription className="text-slate-400">
          Net Profit accumulation over selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <ChartContainer config={dynamicConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 0
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#1e293b"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
              stroke="#64748b"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#64748b"
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="line" />}
            />
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={lineColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={lineColor}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="balance"
              type="natural"
              fill="url(#fillBalance)"
              fillOpacity={0.4}
              stroke={lineColor}
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="relative z-10 border-t border-slate-800/50 pt-4 mt-2">
        <div className="flex w-full items-start gap-2 text-sm leading-none">
          <div className="grid gap-2">
            <div className={`flex items-center gap-2 font-bold leading-none ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
              Average Growth {isProfit ? '+' : ''}{percent}% <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}