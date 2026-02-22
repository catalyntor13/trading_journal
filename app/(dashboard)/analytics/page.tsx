import { getDashboardAccounts, getDashboardStats } from "@/app/actions/dashboard"
import AnalyticsView from "@/components/analytics/analytics-view"

export default async function AnalyticsPage(props: { searchParams: Promise<{ accountId?: string }> }) {
    const searchParams = await props.searchParams
    const accountId = searchParams.accountId

    const [accounts, stats] = await Promise.all([
        getDashboardAccounts(),
        getDashboardStats(accountId)
    ])

    return (
        <AnalyticsView
            accounts={accounts}
            stats={stats}
        />
    )
}
