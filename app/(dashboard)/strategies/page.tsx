

import { StrategyForm } from "@/components/dashboard/StrategyForm"
import { DeleteStrategyButton } from "@/components/dashboard/DeleteStrategyButton"
import { getStrategies } from "@/app/actions/strategies"
import { Activity } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export default async function StrategiesPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const strategies = await getStrategies()

    return (
        <section className="p-6 bg-background/50 min-h-full space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Strategies</h1>
                    <p className="text-muted-foreground text-sm">Monitor and configure your trading algorithms</p>
                </div>
                <StrategyForm />
            </div>

            {/* PAGINATION LOGIC */}
            {(() => {
                const page = searchParams?.page ? parseInt(searchParams.page as string) : 1
                const pageSize = 5
                const totalPages = Math.ceil(strategies.length / pageSize)
                const paginatedStrategies = strategies.slice((page - 1) * pageSize, page * pageSize)

                return (
                    <>
                        <div className="grid gap-4">
                            {strategies.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
                                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium text-foreground">No Strategies Yet</h3>
                                    <p className="text-sm">Create your first trading strategy to get started.</p>
                                </div>
                            ) : (
                                paginatedStrategies.map((strategy) => (
                                    <div key={strategy.id} className="bg-card p-5 rounded-xl border border-border flex flex-col items-start gap-4 group hover:border-primary/50 transition-all shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 shrink-0">
                                                    <Activity className="w-5 h-5" />
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                                        {strategy.name}
                                                    </h3>
                                                    {strategy.description && (
                                                        <p className="text-muted-foreground text-sm">{strategy.description}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                                                <div className="flex items-center gap-6 bg-muted/50 p-3 rounded-lg border border-border">
                                                    <div className="text-center px-2">
                                                        <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                                                        <p className={`text-sm font-bold ${strategy.winRate >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {strategy.winRate}%
                                                        </p>
                                                    </div>
                                                    <div className="w-px h-8 bg-border"></div>
                                                    <div className="text-center px-2">
                                                        <p className="text-xs text-muted-foreground mb-1">Profit</p>
                                                        <p className={`text-sm font-bold ${strategy.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {formatCurrency(strategy.profit)}
                                                        </p>
                                                    </div>
                                                    <div className="w-px h-8 bg-border"></div>
                                                    <div className="text-center px-2">
                                                        <p className="text-xs text-muted-foreground mb-1">Trades</p>
                                                        <p className="text-sm font-bold text-foreground">
                                                            {strategy.totalTrades}
                                                        </p>
                                                    </div>
                                                </div>

                                                <DeleteStrategyButton id={strategy.id} name={strategy.name} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-end p-4 gap-2 mt-4">
                                <Link
                                    href={page > 1 ? `/strategies?page=${page - 1}` : '#'}
                                    className={`px-4 py-2 text-sm rounded-lg border border-border bg-card text-muted-foreground ${page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-muted hover:text-foreground'}`}
                                >
                                    Previous
                                </Link>
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                                <Link
                                    href={page < totalPages ? `/strategies?page=${page + 1}` : '#'}
                                    className={`px-4 py-2 text-sm rounded-lg border border-border bg-card text-muted-foreground ${page >= totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-muted hover:text-foreground'}`}
                                >
                                    Next
                                </Link>
                            </div>
                        )}
                    </>
                )
            })()}
        </section>
    )
}
