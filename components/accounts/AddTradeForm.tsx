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
import Modal from "@/components/myComponents/Modal"
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

const formatNumberStr = (val: string) => {
    if (!val) return "";
    const clean = val.toString().replace(/,/g, '');
    if (isNaN(Number(clean)) && clean !== '.' && clean !== '-') return val;
    const parts = clean.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
};

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
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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
            riskPercent: "1",
            tod: "",
            riskRatio: "",
            comments: "",
            image1: "",
            image2: "",
            fearIndex: "5",
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
                    fearIndex: "5",
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
        <>
            {!initialData && (
                <Button onClick={() => setOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                    <Plus className="w-4 h-4" /> Add Trade
                </Button>
            )}
            
            <Modal 
                isOpen={open} 
                onClose={() => setOpen(false)}
                className="max-w-2xl p-6"
                title={
                    <div className="flex items-center gap-3">
                        {initialData ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                {initialData ? "Edit Trade Entry" : "New Trade Entry"}
                            </span>
                            <span className="text-xs font-normal text-muted-foreground mr-4">
                                {initialData ? "Refine your trade details and analysis." : "Log your execution details and psychological state."}
                            </span>
                        </div>
                    </div>
                }
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 text-left">
                        <input type="hidden" {...form.register("accountId")} value={accountId} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* LEFT COLUMN */}
                            <div className="space-y-6">
                                {/* Execution Details */}
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Execution
                                    </h3>
                                    
                                    <div className="space-y-4 bg-muted/20 p-5 rounded-xl border border-border/50">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="pair"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Pair</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="EUR/USD" {...field} className="bg-card border-border/50 font-mono text-sm h-10 tracking-wide focus-visible:ring-1 focus-visible:ring-primary" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="direction"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Direction</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={cn("bg-card border-border/50 h-10 transition-colors focus:ring-1 focus:ring-primary", field.value === "Buy" ? "text-emerald-500 font-medium" : field.value === "Sell" ? "text-red-500 font-medium" : "")}>
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="date"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Date</FormLabel>
                                                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal bg-card h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-primary transition-colors hover:bg-muted/50 text-sm",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? format(field.value, "MMM dd, yyyy") : <span>Pick a date</span>}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={(date) => {
                                                                        if(date) {
                                                                            field.onChange(date);
                                                                            setIsCalendarOpen(false);
                                                                        }
                                                                    }}
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
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Session</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-card border-border/50 h-10 transition-colors focus:ring-1 focus:ring-primary text-sm">
                                                                    <SelectValue placeholder="Session" />
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

                                        <FormField
                                            control={form.control}
                                            name="strategy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground/80 text-xs font-semibold">Strategy</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-card border-border/50 h-10 focus:ring-1 focus:ring-primary text-sm">
                                                                <SelectValue placeholder="Select Strategy" />
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

                                {/* Psychology Details */}
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Psychology
                                    </h3>
                                    <div className={cn("p-5 rounded-xl border border-dashed transition-colors", fearCtx.bg, fearCtx.border)}>
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                                                    <Brain className={cn("w-3.5 h-3.5", fearCtx.color)} />
                                                    Index
                                                </h3>
                                                <p className="text-[11px] text-muted-foreground mt-1">Trust in your setup</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn("text-2xl font-black tabular-nums block flex justify-end", fearCtx.color)}>
                                                    {fearValue}/10
                                                </span>
                                                <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1 rounded text-foreground", fearValue <= 3 ? "bg-red-500/20" : fearValue <= 6 ? "bg-blue-500/20" : "bg-emerald-500/20")}>
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
                                                            className={cn("w-full py-1 cursor-pointer",
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
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6">
                                {/* Outcome */}
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Outcome
                                    </h3>
                                    <div className="space-y-4 bg-muted/20 p-5 rounded-xl border border-border/50">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="profit"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Net Profit ($)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input 
                                                                    placeholder="0" 
                                                                    {...field} 
                                                                    value={field.value ? formatNumberStr(field.value.toString()) : ""}
                                                                    onChange={(e) => {
                                                                        const rawValue = e.target.value.replace(/,/g, '');
                                                                        field.onChange(rawValue);
                                                                    }}
                                                                    className={cn("bg-card border-border/50 font-mono text-sm h-10 focus-visible:ring-1 focus-visible:ring-primary transition-colors", 
                                                                        parseFloat(field.value?.toString().replace(/,/g, '') || "0") > 0 ? "text-emerald-500 focus-visible:ring-emerald-500" :
                                                                        parseFloat(field.value?.toString().replace(/,/g, '') || "0") < 0 ? "text-red-500 focus-visible:ring-red-500" : ""
                                                                    )} 
                                                                />
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
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Comm. ($)</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                placeholder="0" 
                                                                {...field} 
                                                                value={field.value ? formatNumberStr(field.value.toString()) : ""}
                                                                onChange={(e) => {
                                                                    const rawValue = e.target.value.replace(/,/g, '');
                                                                    field.onChange(rawValue);
                                                                }}
                                                                className="bg-card border-border/50 font-mono text-sm text-red-500/80 h-10 focus-visible:ring-1 focus-visible:ring-primary" 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="riskPercent"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground/80 text-xs font-semibold">Risk %</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="1" 
                                                            {...field} 
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                const cleanStr = e.target.value.replace(/[^0-9]/g, '');
                                                                field.onChange(cleanStr);
                                                            }}
                                                            className="bg-card border-border/50 font-mono text-sm h-10 focus-visible:ring-1 focus-visible:ring-primary w-full" 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Analysis */}
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Analysis
                                    </h3>
                                    <div className="space-y-4 bg-muted/20 p-5 px-4 rounded-xl border border-border/50 flex flex-col h-[278px]">
                                        <FormField
                                            control={form.control}
                                            name="comments"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-foreground/80 text-xs font-semibold">Journal Notes</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="What was your thought process? Key levels? Emotion?"
                                                            {...field}
                                                            className="bg-card border-border/50 h-[130px] resize-none focus-visible:ring-1 focus-visible:ring-primary text-sm shadow-inner"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4 mt-auto">
                                            <FormField
                                                control={form.control}
                                                name="image1"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Chart Link 1</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://..." {...field} className="bg-card border-border/50 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary" />
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
                                                        <FormLabel className="text-foreground/80 text-xs font-semibold">Chart Link 2</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://..." {...field} className="bg-card border-border/50 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </Form>

                <div className="mt-8 border-t border-border/50 pt-6 flex justify-end gap-3">
                    <Button variant="outline" type="button" onClick={() => setOpen(false)} className="border-border/50 hover:bg-muted">Cancel</Button>
                    <Button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 w-32"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update" : "Log Trade"}
                    </Button>
                </div>
            </Modal>
        </>
    )
}
