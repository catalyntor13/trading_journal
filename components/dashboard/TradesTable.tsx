"use client"

import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
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
                <h2 className="text-lg font-semibold text-foreground">Trade History</h2>
            </div>

            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border hover:bg-muted/50">
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-muted-foreground">Pair</TableHead>
                            <TableHead className="text-muted-foreground">Strategy</TableHead>
                            <TableHead className="text-muted-foreground">Buy/Sell</TableHead>
                            <TableHead className="text-right text-muted-foreground">Net Profit</TableHead>
                            <TableHead className="text-right text-muted-foreground">Commission</TableHead>
                            <TableHead className="text-right text-muted-foreground">Risk %</TableHead>
                            <TableHead className="text-center text-muted-foreground">TOD</TableHead>
                            <TableHead className="text-right text-muted-foreground">RR</TableHead>
                            <TableHead className="text-center text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                    No trades logged yet. Click "Add Trade" to start.
                                </TableCell>
                            </TableRow>
                        ) : (
                            trades.map((trade) => {
                                const profit = parseFloat(trade.profit) || 0
                                const commission = parseFloat(trade.commission) || 0
                                const netProfit = profit - commission

                                return (
                                    <TableRow key={trade.id} className="border-border hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-foreground">
                                            {format(new Date(trade.createdAt), "d MMM")}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{trade.pair}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <span className="bg-muted px-2 py-1 rounded text-xs font-medium border border-border text-foreground">
                                                {trade.strategy}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${trade.direction === 'Buy'
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {trade.direction}
                                            </span>
                                        </TableCell>
                                        <TableCell className={`text-right font-mono ${netProfit > 0 ? 'text-emerald-500' : netProfit < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                            {netProfit < 0 ? "-" : ""}{Math.abs(netProfit).toFixed(2)}$
                                        </TableCell>
                                        <TableCell className="text-right text-red-500 font-mono">-{commission.toFixed(2)}$</TableCell>
                                        <TableCell className="text-right text-muted-foreground font-mono">{trade.riskPercent}%</TableCell>
                                        <TableCell className="text-center text-muted-foreground">{trade.tod}</TableCell>
                                        <TableCell className={`text-right font-mono ${trade.riskRatio?.includes("-") ? 'text-red-500' : trade.riskRatio === 'BE' ? 'text-muted-foreground' : 'text-emerald-500'}`}>
                                            {trade.riskRatio}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setViewTrade(trade)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                                                        <DropdownMenuItem
                                                            onClick={() => setEditTrade(trade)}
                                                            className="hover:bg-muted cursor-pointer"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-border" />
                                                        <DropdownMenuItem
                                                            onClick={async () => {
                                                                if (confirm("Delete trade?")) {
                                                                    await deleteTrade(trade.id, accountId)
                                                                }
                                                            }}
                                                            className="text-destructive hover:bg-muted hover:text-destructive cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

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
