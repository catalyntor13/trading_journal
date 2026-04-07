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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-[#0A0B10] border border-white/5 rounded-xl p-3 shadow-2xl flex flex-col gap-2 min-w-[180px]">
          <span className="text-white/80 text-xs font-medium px-1">{label}</span>
          <div className="flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-[#00E599] shrink-0 shadow-[0_0_8px_rgba(0,229,153,0.8)]" />
            <span className="text-white/80 text-xs font-medium">Portfolio Value:</span>
            <span className="text-white font-bold text-sm ml-auto">${new Intl.NumberFormat('de-DE').format(val)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const formattedLineColor = "#00E599";

  return (
    <Card className="bg-[#0A0B10] border border-white/5 rounded-2xl shadow-lg relative overflow-hidden group pb-4">
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-slate-400 text-[11px] font-bold tracking-[0.15em] uppercase">
          Performance Equity Curve
        </CardTitle>
        <div className="h-px w-full bg-slate-800/60 mt-4" />
      </CardHeader>
      <CardContent className="relative z-10 pt-2">
        <ChartContainer config={dynamicConfig} className="h-[350px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: -10,
              right: 10,
              top: 10,
              bottom: 0
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="#1e293b"
              strokeOpacity={0.8}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tickFormatter={(value) => value}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              stroke="#64748b"
              fontSize={11}
              width={85}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${new Intl.NumberFormat('de-DE').format(value)}`}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={<CustomTooltip />}
            />
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={formattedLineColor}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={formattedLineColor}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke={formattedLineColor}
              strokeWidth={2.5}
              stackId="a"
              activeDot={{ r: 5, fill: formattedLineColor, stroke: '#0A0B10', strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}