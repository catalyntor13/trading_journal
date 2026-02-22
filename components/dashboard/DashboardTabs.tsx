"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PortfolioChart } from "@/components/myComponents/PortfolioChart"
import TradingCalendar from "@/components/myComponents/TradingCalendar"
import { TradingPerformanceCard } from "@/components/dashboard/TradingPerformanceCard"
import { useState } from "react"

export function DashboardTabs({ stats }: { stats: any }) {
    const [activeTab, setActiveTab] = useState("chart")

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden md:flex justify-start mb-6">
                <TabsList className="bg-card border border-border p-1 rounded-xl h-auto">
                    <TabsTrigger value="chart" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                        Overview Chart
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                        Trading Calendar
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                        Performance Stats
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* Mobile Select */}
            <div className="md:hidden mb-6">
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full bg-card border-border rounded-xl h-12 text-base">
                        <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="chart">Overview Chart</SelectItem>
                        <SelectItem value="calendar">Trading Calendar</SelectItem>
                        <SelectItem value="performance">Performance Stats</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <TabsContent value="chart" className="mt-0">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground mb-4">Overview</h2>
                    <PortfolioChart data={stats.chartData} />
                </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
                <div className="border border-border bg-card rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 px-2 text-foreground">Trading Calendar</h3>
                    <TradingCalendar data={stats.calendarData} />
                </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
                <div className="grid grid-cols-1 gap-6 h-[400px]">
                    <TradingPerformanceCard stats={stats} />
                </div>
            </TabsContent>
        </Tabs>
    )
}
