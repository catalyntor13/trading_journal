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
        <Card className={cn("border-none shadow-sm hover:shadow-md transition-shadow", className)}>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                </div>
                <div className={cn("p-3 rounded-full", iconBg)}>
                    <Icon className={cn("w-6 h-6", iconColor)} />
                </div>
            </CardContent>
        </Card>
    )
}
