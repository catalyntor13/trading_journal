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
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Activity, Loader2 } from "lucide-react"
import { createStrategy } from "@/app/actions/strategies"
import { strategySchema, type StrategyFormValues } from "@/lib/schemas"
// import { toast } from "sonner" 

// I will assume there is a toast system or valid alert. I'll check imports later.

export function StrategyForm() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<StrategyFormValues>({
        resolver: zodResolver(strategySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    async function onSubmit(data: StrategyFormValues) {
        setIsLoading(true)
        const result = await createStrategy(data)
        setIsLoading(false)

        if (result?.error) {
            alert(result.error)
        } else {
            setOpen(false)
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Activity className="w-4 h-4" /> New Strategy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#161b26] border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-white">Add New Strategy</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Define your trading strategy.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Strategy Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MACD Momentum" {...field} className="bg-slate-900 border-slate-700 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Explain the strategy rules..." {...field} className="bg-slate-900 border-slate-700 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Strategy
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
