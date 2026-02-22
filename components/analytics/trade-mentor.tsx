"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, Target } from "lucide-react"

interface TradeMentorProps {
    stats: {
        profitFactorValue: number
        maxDrawdownValue: number
        avgRiskRewardValue: number
        winRateValue: number
        sharpeRatioValue: number
        currentLossStreak: number
    }
}

export function TradeMentor({ stats }: TradeMentorProps) {
    const {
        profitFactorValue,
        maxDrawdownValue,
        avgRiskRewardValue,
        winRateValue,
        sharpeRatioValue,
        currentLossStreak
    } = stats

    // Helper to generate feedback items
    const getFeedback = () => {
        const feedback = []

        // Profit Factor
        if (profitFactorValue < 1) {
            feedback.push({
                category: "Profit Factor",
                status: "danger",
                message: "Your strategy is losing money. Review your risk-reward ratio. Cut losses quicker, and prioritize higher-quality setups with better payoff.",
                icon: AlertCircle
            })
        } else if (profitFactorValue <= 1.5) {
            feedback.push({
                category: "Profit Factor",
                status: "warning",
                message: "You're near break-even. Work on improving your average reward per trade and reducing risk per position. Tighten stop-loss levels and filter out low R setups.",
                icon: AlertTriangle
            })
        } else {
            feedback.push({
                category: "Profit Factor",
                status: "success",
                message: "Solid profit factor! Maintain discipline and consistent execution. Avoid over-risking. Look for ways to scale without increasing risk.",
                icon: CheckCircle2
            })
        }

        // Drawdown (Note: MaxDrawdown is positive %, so comparing 5, 10)
        // Drawdown logic from prompt:
        // <5% -> Great
        // 5-10% -> Warning
        // >10% -> Danger
        if (maxDrawdownValue < 5) {
            feedback.push({
                category: "Drawdown",
                status: "success",
                message: "Great risk control. Keep enforcing strict stop-loss discipline and only take high-quality trades.",
                icon: ShieldCheck
            })
        } else if (maxDrawdownValue <= 10) {
            feedback.push({
                category: "Drawdown",
                status: "warning",
                message: "Start reviewing trade selection and risk size. Avoid increasing exposure after a loss. Stick to your plan.",
                icon: AlertTriangle
            })
        } else {
            feedback.push({
                category: "Drawdown",
                status: "danger",
                message: "This suggests potential emotional or over-leveraged trading. Pause if needed. Reduce risk, reset mentally, and focus on structured recovery.",
                icon: AlertCircle
            })
        }

        // Risk Reward
        // < 1:1 -> Danger
        // 1:1 - 1:2 -> Warning
        // > 1:2 -> Success
        if (avgRiskRewardValue < 1) {
            feedback.push({
                category: "Risk Reward",
                status: "danger",
                message: "Negative expectancy. Even with a high win rate, this is a dangerous path. One large loss could wipe out many wins. Work on letting your winners run or tightening your entries.",
                icon: AlertCircle
            })
        } else if (avgRiskRewardValue <= 2) {
            feedback.push({
                category: "Risk Reward",
                status: "warning",
                message: "Standard payoff. You have a functional edge, but your profitability depends heavily on your win rate. Look for \"high-conviction\" setups where you can push for a 2.5:1 or 3:1 return.",
                icon: Target
            })
        } else {
            feedback.push({
                category: "Risk Reward",
                status: "success",
                message: "Strong mathematical edge. Your strategy allows for mistakes and losing streaks while remaining profitable. This is the most sustainable way to grow an account long-term.",
                icon: TrendingUp
            })
        }

        // Win Rate
        // < 40 -> Warning
        // 40 - 60 -> Success
        // > 60 -> Success (High Execution)
        if (winRateValue < 40) {
            feedback.push({
                category: "Win Rate",
                status: "warning",
                message: "Precision needed. While a low win rate can be profitable with a high Reward-to-Risk (RR), it increases the risk of long losing streaks. Ensure your winners are large enough to cover the frequent small losses.",
                icon: Target
            })
        } else if (winRateValue <= 60) {
            feedback.push({
                category: "Win Rate",
                status: "success",
                message: "Healthy balance. You have a sustainable win rate. Focus on maintaining your average RR to ensure your \"edge\" remains mathematically sound over a large sample of trades.",
                icon: CheckCircle2
            })
        } else {
            feedback.push({
                category: "Win Rate",
                status: "success",
                message: "High execution accuracy. You are picking high-probability setups. Be careful not to become overconfident; ensure you aren't \"pruning\" winners too early just to keep your win rate high.",
                icon: CheckCircle2
            })
        }

        // Sharpe Ratio
        // < 1 -> Danger
        // 1 - 2 -> Warning
        // > 2 -> Success
        if (sharpeRatioValue < 1) {
            feedback.push({
                category: "Sharpe Ratio",
                status: "danger",
                message: "Low risk-adjusted returns. Your account is experiencing too much volatility for the profit generated. Focus on smoothing your equity curve by cutting losses earlier and avoiding high-risk, low-probability setups.",
                icon: AlertCircle
            })
        } else if (sharpeRatioValue <= 2) {
            feedback.push({
                category: "Sharpe Ratio",
                status: "warning",
                message: "Adequate efficiency. You are generating decent returns, but there's room to optimize. Look for ways to reduce your maximum fluctuations without significantly cutting into your winners.",
                icon: AlertTriangle
            })
        } else {
            feedback.push({
                category: "Sharpe Ratio",
                status: "success",
                message: "Excellent risk efficiency. You are capturing high returns with controlled volatility. This is the hallmark of a professional approach. Maintain your current risk parameters and scaling plan.",
                icon: TrendingUp
            })
        }

        // Consecutive Stop Losses
        // 1-3 -> Success (Natural)
        // 4-6 -> Warning
        // 7+ -> Danger
        if (currentLossStreak <= 3) {
            feedback.push({
                category: "Losing Streak",
                status: "success",
                message: "Standard market variance. Small losing streaks are a natural part of trading. Stay disciplined, follow your rules, and don't let these minor setbacks influence your next execution.",
                icon: ShieldCheck
            })
        } else if (currentLossStreak <= 6) {
            feedback.push({
                category: "Losing Streak",
                status: "warning",
                message: "Loss streak detected. Review if you are forcing trades or if the market environment has shifted. Consider reducing your position size until you regain your rhythm and hit a winning trade.",
                icon: AlertTriangle
            })
        } else {
            feedback.push({
                category: "Losing Streak",
                status: "danger",
                message: "Critical streak. Stop trading. This indicates either a major shift in market regime or emotional \"revenge\" trading. Step away from the charts, review your data, and only return once you've identified the leak.",
                icon: AlertCircle
            })
        }

        return feedback
    }

    const feedbackItems = getFeedback()

    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Trade Mentor
                </CardTitle>
                <p className="text-sm text-muted-foreground">AI-driven analysis of your trading behavior.</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                <div className="grid gap-4">
                    {feedbackItems.map((item, index) => (
                        <div key={index} className={`flex gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${item.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20' :
                                item.status === 'warning' ? 'bg-orange-500/5 border-orange-500/10 hover:border-orange-500/20' :
                                    'bg-red-500/5 border-red-500/10 hover:border-red-500/20'
                            }`}>
                            <div className={`mt-0.5 p-2 rounded-lg h-fit ${item.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                    item.status === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                        'bg-red-500/10 text-red-500'
                                }`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`text-base font-bold mb-1 ${item.status === 'success' ? 'text-emerald-500' :
                                        item.status === 'warning' ? 'text-orange-500' :
                                            'text-red-500'
                                    }`}>
                                    {item.category}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
