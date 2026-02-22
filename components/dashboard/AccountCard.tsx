"use client"

import { useRouter } from "next/navigation"
import { Wallet, MoreVertical, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteAccount } from "@/app/actions/accounts"

interface AccountCardProps {
    account: {
        id: string
        name: string
        type: string
        balance: string | number
        initialBalance: number | null
        broker: string | null
    }
}

export function AccountCard({ account }: AccountCardProps) {
    const router = useRouter()

    return (
        <div
            onClick={() => router.push(`/accounts/${account.id}`)}
            className="bg-card cursor-pointer p-6 rounded-2xl border border-border hover:border-primary/50 transition-all relative shadow-sm group h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Wallet className="w-6 h-6" />
                </div>
                {/* Stop Propagation to prevent Card click when using Menu */}
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                            <form action={async () => {
                                await deleteAccount(account.id)
                            }}>
                                <button type="submit" className="flex w-full items-center px-2 py-1.5 text-sm outline-none hover:bg-muted text-destructive cursor-pointer transition-colors rounded-sm">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                </button>
                            </form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {account.name}
                    </h3>
                    <span className="bg-muted text-[10px] uppercase font-bold px-2 py-1 rounded text-muted-foreground border border-border">
                        {account.type}
                    </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{account.broker || "Unknown Broker"} • ID: {account.id.slice(0, 8)}...</p>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Balance</p>
                        <h4 className={`text-2xl font-mono font-medium ${Number(account.balance) >= (account.initialBalance || 0) ? 'text-emerald-500' : 'text-red-500'}`}>
                            {formatCurrency(Number(account.balance))}
                        </h4>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        {Number(account.balance) >= (account.initialBalance || 0)
                            ? <TrendingUp className="w-4 h-4 text-emerald-500" />
                            : <TrendingDown className="w-4 h-4 text-red-500" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
