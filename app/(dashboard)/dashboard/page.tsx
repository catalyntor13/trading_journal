import { cn, formatCurrency } from "@/lib/utils"
import { Wallet, Activity, DollarSign } from "lucide-react"
import { getAccounts } from "@/app/actions/accounts"
import { getDashboardStats } from "@/app/actions/dashboard"
import { StatsCard } from "@/components/dashboard/stats-card"

import { AccountSelector } from "@/components/dashboard/AccountSelector"
import { DashboardTabs } from "@/components/dashboard/DashboardTabs"

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ accountId?: string }> }) {
  const { accountId } = await searchParams
  const accounts = await getAccounts()
  const stats = await getDashboardStats(accountId)

  if (!stats) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard data. Please try again.
      </div>
    )
  }

  return (
    <section className="p-6 space-y-8 min-h-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-slate-300 tracking-tight">My Portfolio</h1>
          <p className="text-slate-400 text-sm">Overview of your trading performance</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0A101C] p-1.5 rounded-xl border border-slate-800/60 shadow-sm">
          <Wallet className="w-4 h-4 text-slate-400 ml-2" />
          <AccountSelector accounts={accounts} />
        </div>
      </div>

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          icon={Wallet}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatsCard
          label="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon={DollarSign}
          iconColor={stats.netProfit >= 0 ? "text-emerald-500" : "text-red-500"}
          iconBg={stats.netProfit >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}
        />
        <StatsCard
          label="Win Rate"
          value={stats.winRate}
          icon={Activity}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
        />
      </div>

      {/* MAIN CONTENT TABS */}
      <div>
        <DashboardTabs stats={stats} />
      </div>

    </section>
  )
}