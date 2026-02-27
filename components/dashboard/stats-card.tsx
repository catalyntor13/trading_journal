import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
    className?: string
    iconColor?: string
    iconBg?: string
}

export function StatsCard({ label, value, icon: Icon, trend, trendUp, className, iconColor = "text-primary", iconBg = "bg-primary/10" }: StatsCardProps) {
    return (
        <Card className={cn("bg-[#0A101C] border border-slate-800/60 rounded-2xl", className)}>
            <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center border justify-center", iconBg)}>
                    <Icon className={cn("w-6 h-6", iconColor)} />
                </div>
            </CardContent>
        </Card>
    )
}
