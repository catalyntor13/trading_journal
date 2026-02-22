"use client"

import { addTrade, updateTrade } from "@/app/actions/accounts"
import { tradeSchema, type TradeFormValues } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

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
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus, Loader2, Brain, Pencil } from "lucide-react"
import { Slider } from "@/components/ui/slider"

// Helper function for RR calculation
const calculateRR = (profitStr: string, riskPercentStr: string, balance: number) => {
    const profit = parseFloat(profitStr)
    const riskPercent = parseFloat(riskPercentStr)
    if (isNaN(profit) || isNaN(riskPercent) || riskPercent === 0 || balance === 0) return ""

    const riskAmount = balance * (riskPercent / 100) // 10000 * 0.01 = 100
    const rr = profit / riskAmount

    if (profit > 0) return `${rr.toFixed(2)}R`
    if (profit < 0) return `${rr.toFixed(2)}R` // negative
    return "BE"
}

interface AddTradeFormProps {
    accountId: string
    strategies: { id: string; name: string }[]
    accountBalance: number
    initialData?: TradeFormValues & { id: string } // For Edit
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function AddTradeForm({
    accountId,
    strategies,
    accountBalance,
    initialData,
    open: controlledOpen,
    onOpenChange
}: AddTradeFormProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<TradeFormValues>({
        resolver: zodResolver(tradeSchema),
        defaultValues: initialData ? {
            ...initialData,
            date: initialData.date ? new Date(initialData.date) : new Date(),
        } : {
            accountId: accountId,
            date: new Date(),
            pair: "",
            strategy: "",
            direction: "Buy",
            profit: "",
            commission: "",
            riskPercent: "1.0",
            tod: "",
            riskRatio: "",
            comments: "",
            image1: "",
            image2: "",
            fearIndex: "",
        },
    })

    async function onSubmit(data: TradeFormValues) {
        setIsLoading(true)

        // Calculate RR
        const rr = calculateRR(data.profit || "0", data.riskPercent || "0", accountBalance)
        data.riskRatio = rr

        let result
        if (initialData?.id) {
            result = await updateTrade(initialData.id, accountId, data)
        } else {
            result = await addTrade(data)
        }

        setIsLoading(false)

        if (result?.error) {
            alert(result.error)
        } else {
            setOpen(false)
            if (!initialData) {
                form.reset({
                    ...form.getValues(),
                    date: new Date(),
                    pair: "",
                    profit: "",
                    commission: "",
                    comments: "",
                    image1: "",
                    image2: "",
                    fearIndex: "",
                })
            }
        }
    }

    // Dynamic Fear Index Text
    const fearValue = form.watch("fearIndex") ? parseInt(form.watch("fearIndex") as string) : 5
    const getFearContext = (val: number) => {
        if (val <= 3) return { label: "High Fear / Low Conviction", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" }
        if (val <= 6) return { label: "Moderate / Neutral", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
        return { label: "High Conviction / Strong Mindset", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
    }
    const fearCtx = getFearContext(fearValue)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!initialData && (
                <DialogTrigger asChild>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                        <Plus className="w-4 h-4" /> Add Trade
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50 text-card-foreground overflow-hidden shadow-2xl p-0 gap-0">

                {/* Header */}
                <div className="p-6 border-b border-border/50 bg-muted/20">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            {initialData ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                            {initialData ? "Edit Trade Entry" : "New Trade Entry"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {initialData ? "Refine your trade details and analysis." : "Log your execution details and psychological state."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 overflow-y-auto max-h-[75vh]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Hidden Account ID */}
                            <input type="hidden" {...form.register("accountId")} value={accountId} />

                            {/* SECTION 1: Execution Details */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary" /> Execution Details
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-foreground/80">Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal bg-background/50 border-border/50 focus:border-primary transition-colors hover:bg-muted/50",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={(date) => date && field.onChange(date)}
                                                            disabled={(date) => {
                                                                const today = new Date();
                                                                today.setHours(23, 59, 59, 999);
                                                                return date > today || date < new Date("1900-01-01");
                                                            }}
                                                            initialFocus
                                                            className="text-foreground"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="tod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Session</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors">
                                                            <SelectValue placeholder="Select Session" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-popover border-border">
                                                        <SelectItem value="London">London</SelectItem>
                                                        <SelectItem value="NY">New York</SelectItem>
                                                        <SelectItem value="Asian">Asian</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-4">
                                        <FormField
                                            control={form.control}
                                            name="pair"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground/80">Pair</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="EUR/USD" {...field} className="bg-background/50 border-border/50 font-mono tracking-wide" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormField
                                            control={form.control}
                                            name="direction"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground/80">Direction</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={cn("bg-background/50 border-border/50 transition-colors", field.value === "Buy" ? "text-emerald-500" : field.value === "Sell" ? "text-red-500" : "")}>
                                                                <SelectValue placeholder="Action" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-popover border-border">
                                                            <SelectItem value="Buy" className="text-emerald-500 font-medium">Buy (Long)</SelectItem>
                                                            <SelectItem value="Sell" className="text-red-500 font-medium">Sell (Short)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormField
                                            control={form.control}
                                            name="strategy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground/80">Strategy</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-background/50 border-border/50">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-popover border-border">
                                                            {strategies.map(s => (
                                                                <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Psychology (Fear Index) */}
                            <div className={cn("p-5 rounded-xl border border-dashed transition-colors", fearCtx.bg, fearCtx.border)}>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Brain className={cn("w-4 h-4", fearCtx.color)} />
                                            Index
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">Trust in your setup</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("text-2xl font-black tabular-nums block", fearCtx.color)}>
                                            {fearValue}/10
                                        </span>
                                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-background/50 border border-border/50", fearCtx.color)}>
                                            {fearCtx.label}
                                        </span>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="fearIndex"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Slider
                                                    defaultValue={[parseInt(field.value || "5")]}
                                                    max={10}
                                                    min={1}
                                                    step={1}
                                                    className={cn("w-full py-2 cursor-pointer",
                                                        fearValue <= 3 ? "[&>.bg-primary]:bg-red-500" :
                                                            fearValue <= 6 ? "[&>.bg-primary]:bg-blue-500" :
                                                                "[&>.bg-primary]:bg-emerald-500"
                                                    )}
                                                    onValueChange={(vals) => field.onChange(vals[0].toString())}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* SECTION 3: Outcome */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary" /> Outcome
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="profit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Net Profit ($)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="0.00" {...field} className="bg-background/50 border-border/50 pl-3 md:text-lg font-mono" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="commission"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Comm. ($)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.00" {...field} className="bg-background/50 border-border/50 font-mono text-xs md:text-sm" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="riskPercent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Risk %</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1.0" {...field} className="bg-background/50 border-border/50 font-mono text-xs md:text-sm" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* SECTION 4: Analysis */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="image1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Chart URL 1</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} className="bg-background/50 border-border/50 text-xs" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="image2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Chart URL 2</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} className="bg-background/50 border-border/50 text-xs" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="comments"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Analysis & Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="What was your thought process? Key levels? Psychology?"
                                                        {...field}
                                                        className="bg-background/50 border-border/50 min-h-[100px] resize-none focus:ring-1 focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-border/50 hover:bg-muted">Cancel</Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 w-32"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update" : "Log Trade"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
