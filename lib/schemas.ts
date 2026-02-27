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
    balance: z.string().min(1, "Balance is required"),
    type: z.string().min(1, "Type is required"),
    broker: z.string().min(1, "Broker is required"),
})

export type AccountFormValues = z.infer<typeof accountSchema>

export const tradeSchema = z.object({
    accountId: z.string(),
    date: z.date(),
    pair: z.string().min(1, "Pair is required"),
    strategy: z.string().min(1, "Strategy is required"),
    direction: z.enum(["Buy", "Sell"]),
    profit: z.string().min(1, "Profit is required"), // Input as string, store as text/numeric
    commission: z.string().min(1, "Commission is required"),
    riskPercent: z.string().min(1, "Risk % is required"),
    tod: z.string().min(1, "Session is required"), // Time of Day / Session
    riskRatio: z.string().optional(), // Auto calculated
    comments: z.string().min(1, "Analysis/Comments are required"),
    image1: z.string().optional(),
    image2: z.string().optional(),
    fearIndex: z.string().min(1, "Fear Index is required")
})

export type TradeFormValues = z.infer<typeof tradeSchema>
