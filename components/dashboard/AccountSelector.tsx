"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface AccountSelectorProps {
    accounts: { id: string; name: string }[]
}

export function AccountSelector({ accounts }: AccountSelectorProps) { // Accounts passed from server
    const router = useRouter()
    const searchParams = useSearchParams()

    // Default to 'all' or first account or existing param
    const currentAccount = searchParams.get("accountId") || "all"

    const handleValueChange = (val: string) => {
        const params = new URLSearchParams(searchParams)
        if (val === "all") {
            params.delete("accountId")
        } else {
            params.set("accountId", val)
        }
        router.push(`/dashboard?${params.toString()}`)
    }

    return (
        <Select value={currentAccount} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px] bg-transparent border-none text-foreground focus:ring-0 shadow-none h-8 p-0">
                <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
