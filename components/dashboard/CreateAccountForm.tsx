"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { createAccount } from "@/app/actions/accounts"
import { accountSchema, type AccountFormValues } from "@/lib/schemas"
import { useRouter } from "next/navigation"

export function CreateAccountForm({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            balance: "",
            type: "Live",
            broker: "",
        },
    })

    async function onSubmit(data: AccountFormValues) {
        setIsLoading(true)
        const result = await createAccount(data)
        setIsLoading(false)

        if (result?.error) {
            alert(result.error)
        } else {
            setOpen(false)
            form.reset()
            if (result?.id) {
                router.push(`/accounts/${result.id}`)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                        <Plus className="w-4 h-4" /> Add Account
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border/50 text-card-foreground overflow-hidden shadow-2xl p-0 gap-0">
                <div className="p-6 border-b border-border/50 bg-muted/20">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Plus className="w-5 h-5 text-emerald-500" />
                            Connect New Account
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Add details about your trading account.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/80">Account Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Main Trading Account" {...field} className="bg-background/50 border-border/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="balance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/80">Initial Balance</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10000" {...field} className="bg-background/50 border-border/50 font-mono" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="broker"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/80">Broker / Exchange</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Binance" {...field} className="bg-background/50 border-border/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/80">Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background/50 border-border/50">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-popover border-border">
                                                <SelectItem value="Live">Live</SelectItem>
                                                <SelectItem value="Demo">Demo</SelectItem>
                                                <SelectItem value="Funded">Funded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border/50 hover:bg-muted">Cancel</Button>
                                <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Connect Account
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
