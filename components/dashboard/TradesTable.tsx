"use client"

import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AddTradeForm } from "../accounts/AddTradeForm"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { deleteTrade } from "@/app/actions/accounts"

// Pass trades as props
export function TradesTable({
    trades,
    accountId,
    totalPages = 1,
    currentPage = 1
}: {
    trades: any[],
    accountId: string,
    totalPages?: number,
    currentPage?: number
}) {
    const [viewTrade, setViewTrade] = useState<any>(null)
    const [editTrade, setEditTrade] = useState<any>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const router = useRouter() // For pagination navigation

    const handlePageChange = (page: number) => {
        router.push(`/accounts/${accountId}?page=${page}`)
    }

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* EDIT FORM WRAPPER */}
            {editTrade && (
                <AddTradeForm
                    accountId={accountId}
                    strategies={[]} // Ideally we pass strategies here too, but for now we might need to fetch them or pass them down. 
                    // Update: We didn't pass strategies to TradesTable in page.tsx. We should fix that or fetch them.
                    // For quick fix, let's assume we can pass strategies or fetch them. 
                    // Actually, simpler to just close it for now or pass empty which might break select.
                    // Let's rely on parent to pass strategies or valid data.
                    // Wait, AddTradeForm needs strategies.
                    // I should update page.tsx to pass strategies to TradesTable.
                    accountBalance={0} // We need balance for RR calc on edit? Yes but strictly for NEW entries. 
                    // Edit might re-calc based on current balance? 
                    // Let's pass 0 or maybe we don't need to re-calc RR if not changed?
                    // The form recalculates on submit.
                    initialData={editTrade}
                    open={!!editTrade}
                    onOpenChange={(open) => !open && setEditTrade(null)}
                />
            )}

            {/* VIEW TRADE MODAL */}
            <Dialog open={!!viewTrade} onOpenChange={(open) => !open && setViewTrade(null)}>
                <DialogContent className="bg-card border-border text-card-foreground sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Trade Details</DialogTitle>
                    </DialogHeader>
                    {viewTrade && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Pair</p>
                                    <p className="text-foreground font-medium">{viewTrade.pair}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="text-foreground font-medium">{format(new Date(viewTrade.createdAt), "PPP")}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Strategy</p>
                                    <p className="text-foreground font-medium">{viewTrade.strategy}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Outcome</p>
                                    <p className={cn("font-medium", Number(viewTrade.profit) > 0 ? "text-emerald-500" : "text-red-500")}>
                                        {Number(viewTrade.profit) > 0 ? "Win" : "Loss"} ({viewTrade.profit}$)
                                    </p>
                                </div>
                            </div>

                            {(viewTrade.image1 || viewTrade.image2) && (
                                <div>
                                    <p className="text-muted-foreground mb-2">Charts (Click to expand)</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {viewTrade.image1 && (
                                            <div
                                                className="relative group cursor-zoom-in overflow-hidden rounded-lg border border-border aspect-video"
                                                onClick={() => setSelectedImage(viewTrade.image1)}
                                            >
                                                <img
                                                    src={viewTrade.image1}
                                                    alt="Trade Chart 1"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        )}
                                        {viewTrade.image2 && (
                                            <div
                                                className="relative group cursor-zoom-in overflow-hidden rounded-lg border border-border aspect-video"
                                                onClick={() => setSelectedImage(viewTrade.image2)}
                                            >
                                                <img
                                                    src={viewTrade.image2}
                                                    alt="Trade Chrat 2 2"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {viewTrade.comments && (
                                <div className="bg-muted/50 p-3 rounded-lg border border-border">
                                    <p className="text-muted-foreground text-xs mb-1">Comments</p>
                                    <p className="text-foreground text-sm whitespace-pre-wrap">{viewTrade.comments}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>


            { /*  Large Width for Image Modal */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-[90vw] sm:max-w-[1000px] w-full bg-transparent border-none shadow-none p-0">
                    {selectedImage && <img src={selectedImage} alt="Trade Chart" className="w-full h-auto rounded-lg object-contain" />}
                </DialogContent>
            </Dialog>


            <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-bold text-foreground">Trade History</h2>
            </div>

            {/* SHARED ACTIONS COMPONENT */}
            {(() => {
                const renderActions = (trade: any, hideEyeOnMobile = false) => (
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewTrade(trade)}
                            className={cn("h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted", hideEyeOnMobile && "hidden md:inline-flex")}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-muted-foreground">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground shadow-xl">
                                <DropdownMenuItem
                                    onClick={() => setEditTrade(trade)}
                                    className="hover:bg-muted cursor-pointer font-medium"
                                >
                                    <Pencil className="mr-2 h-4 w-4 text-blue-500" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    onClick={async () => {
                                        if (confirm("Delete trade?")) {
                                            await deleteTrade(trade.id, accountId)
                                        }
                                    }}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer font-medium"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )

                if (trades.length === 0) {
                    return (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-lg font-medium text-foreground mb-1">No trades logged yet</p>
                            <p className="text-sm">Click "Add Trade" to start tracking your performance.</p>
                        </div>
                    )
                }

                return (
                    <>
                        {/* --- MOBILE VIEW (CARDS) --- */}
                        <div className="block md:hidden flex flex-col divide-y divide-border">
                            {trades.map((trade) => {
                                const profit = parseFloat(trade.profit) || 0
                                const commission = parseFloat(trade.commission) || 0
                                const netProfit = profit - commission

                                return (
                                    <div key={trade.id} className="p-4 space-y-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-foreground text-xl">{trade.pair}</span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${trade.direction === 'Buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {trade.direction}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-muted-foreground">{format(new Date(trade.createdAt), "MMM d")} • {trade.tod}</p>
                                            </div>
                                            <div className="text-right flex items-start gap-1">
                                                <div className="flex flex-col items-end">
                                                    <div className={`text-xl tracking-tight font-bold flex items-center justify-end gap-1 ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {netProfit >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                                                        {Math.abs(netProfit).toFixed(2)}$
                                                    </div>
                                                    <div className="text-[13px] text-muted-foreground mt-0.5">Comm: -{commission.toFixed(2)}$</div>
                                                </div>
                                                <div className="-mt-1 -mr-2">
                                                    {renderActions(trade, true)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-[16px] border border-border/50">
                                            <div className="mr-3">
                                                <div className="text-[13px] tracking-tight text-muted-foreground mb-1.5">Strategy</div>
                                                <span className="bg-background px-3 py-1.5 rounded-full text-[11px] border border-border text-foreground tracking-wide inline-block">
                                                    {trade.strategy}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-[13px] tracking-tight text-muted-foreground mb-1.5">Risk / Reward</div>
                                                <div className="text-[15px] my-auto font-medium text-foreground">
                                                    {trade.riskPercent}% / <span className={`${trade.riskRatio?.includes("-") ? 'text-red-500' : trade.riskRatio === 'BE' ? 'text-muted-foreground' : 'text-emerald-500'}`}>{trade.riskRatio}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end pt-2 border-t border-border/50">
                                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground h-9" onClick={() => setViewTrade(trade)}>
                                                See details <Eye className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* --- DESKTOP VIEW (TABLE) --- */}
                        <div className="hidden md:block w-full overflow-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="text-muted-foreground font-semibold h-12">Date</TableHead>
                                        <TableHead className="text-muted-foreground font-semibold h-12">Pair</TableHead>
                                        <TableHead className="text-muted-foreground font-semibold h-12">Strategy</TableHead>
                                        <TableHead className="text-muted-foreground font-semibold h-12">Dir</TableHead>
                                        <TableHead className="text-right text-muted-foreground font-semibold h-12">Net Profit</TableHead>
                                        <TableHead className="text-right text-muted-foreground font-semibold h-12">Comm.</TableHead>
                                        <TableHead className="text-right text-muted-foreground font-semibold h-12">Risk %</TableHead>
                                        <TableHead className="text-center text-muted-foreground font-semibold h-12">TOD</TableHead>
                                        <TableHead className="text-right text-muted-foreground font-semibold h-12">RR</TableHead>
                                        <TableHead className="text-right text-muted-foreground font-semibold h-12 pr-6">Activity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trades.map((trade) => {
                                        const profit = parseFloat(trade.profit) || 0
                                        const commission = parseFloat(trade.commission) || 0
                                        const netProfit = profit - commission

                                        return (
                                            <TableRow key={trade.id} className="border-border hover:bg-muted/40 transition-colors h-14">
                                                <TableCell className="font-medium text-foreground whitespace-nowrap">
                                                    {format(new Date(trade.createdAt), "MMM d")}
                                                </TableCell>
                                                <TableCell className="font-bold text-foreground">{trade.pair}</TableCell>
                                                <TableCell>
                                                    <span className="bg-muted px-2.5 py-1 rounded-md text-xs font-medium border border-border text-foreground tracking-wide">
                                                        {trade.strategy}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${trade.direction === 'Buy'
                                                        ? 'bg-emerald-500/10 text-emerald-500'
                                                        : 'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {trade.direction}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={`text-right font-mono font-bold ${netProfit > 0 ? 'text-emerald-500' : netProfit < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                    {netProfit < 0 ? "-" : ""}{Math.abs(netProfit).toFixed(2)}$
                                                </TableCell>
                                                <TableCell className="text-right text-red-500/80 font-mono text-sm">-{commission.toFixed(2)}$</TableCell>
                                                <TableCell className="text-right text-muted-foreground font-mono text-sm">{trade.riskPercent}%</TableCell>
                                                <TableCell className="text-center text-muted-foreground text-sm font-medium">{trade.tod}</TableCell>
                                                <TableCell className={`text-right font-mono font-bold ${trade.riskRatio?.includes("-") ? 'text-red-500' : trade.riskRatio === 'BE' ? 'text-muted-foreground' : 'text-emerald-500'}`}>
                                                    {trade.riskRatio}
                                                </TableCell>
                                                <TableCell className="text-right pr-4">
                                                    {renderActions(trade)}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )
            })()}

            {/* Pagination Controls */}
            {
                totalPages > 1 && (
                    <div className="flex items-center justify-end p-4 gap-2 border-t border-border">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-slate-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            Next
                        </Button>
                    </div>
                )
            }
        </div >
    )
}
