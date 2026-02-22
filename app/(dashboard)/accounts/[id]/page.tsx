

import { getTrades, getAccount } from "@/app/actions/accounts"
import { getStrategies } from "@/app/actions/strategies"
import { AddTradeForm } from "@/components/accounts/AddTradeForm"
import { TradesTable } from "@/components/dashboard/TradesTable"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"


export default async function AccountDetailsPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ page?: string }>
}) {
    // Note: params is a promise in newer Next.js versions (15+), but here 14/15 transition. 

    const { id } = await params // Awaiting just in case using Next 15
    const { page: pageParam } = await searchParams
    const page = Number(pageParam) || 1

    const account = await getAccount(id)
    const { trades, totalCount } = await getTrades(id, page)
    const strategies = await getStrategies()

    if (!account) {
        return <div className="p-8 text-center text-red-400">Account not found</div>
    }

    return (
        <section className="p-6 bg-background/50 min-h-full space-y-6">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <Link href="/accounts" className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Accounts
                    </Link>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">{account.name}</h1>
                            <Badge variant="outline" className="bg-background/50 backdrop-blur text-muted-foreground border-border/50">
                                {account.broker || "Broker"}
                            </Badge>
                            <Badge className={cn("text-xs font-medium",
                                account.type === "Live" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
                            )}>
                                {account.type}
                            </Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">Current Balance:</span>
                            <span className={cn("text-4xl font-bold tracking-tight tabular-nums",
                                Number(account.balance) >= (account.initialBalance || Number(account.balance)) ? "text-emerald-500" : "text-red-500"
                            )}>
                                ${Number(account.balance).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                <AddTradeForm
                    accountId={id}
                    strategies={strategies}
                    accountBalance={Number(account.balance)}
                />
            </div>

            <TradesTable
                trades={trades}
                accountId={id}
                totalPages={Math.ceil(totalCount / 10)}
                currentPage={page}
            />
        </section >
    )
}
