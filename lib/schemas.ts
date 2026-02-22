import { z } from "zod"

export const strategySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional()
})

export type StrategyFormValues = z.infer<typeof strategySchema>

export const accountSchema = z.object({
    name: z.string().min(2, {
        message: "Account name must be at least 2 characters.",
    }),
    balance: z.string().optional(),
    type: z.string().optional(),
    broker: z.string().optional(),
})

export type AccountFormValues = z.infer<typeof accountSchema>

export const tradeSchema = z.object({
    accountId: z.string(),
    date: z.date(),
    pair: z.string().optional(),
    strategy: z.string().optional(),
    direction: z.enum(["Buy", "Sell"]),
    profit: z.string(), // Input as string, store as text/numeric
    commission: z.string().optional(),
    riskPercent: z.string().optional(),
    tod: z.string().optional(), // Time of Day / Session
    riskRatio: z.string().optional(),
    comments: z.string().optional(),
    image1: z.string().optional(),
    image2: z.string().optional(),
    fearIndex: z.string().optional()
})

export type TradeFormValues = z.infer<typeof tradeSchema>
