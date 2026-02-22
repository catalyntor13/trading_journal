

import { getAccounts, deleteAccount } from "@/app/actions/accounts"
import { CreateAccountForm } from "@/components/dashboard/CreateAccountForm"
import { AccountCard } from "@/components/dashboard/AccountCard"
import Link from "next/link"

export default async function AccountsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { page: pageParam } = await searchParams
    const accounts = await getAccounts()


    return (
        <section className="p-6 bg-background/50 min-h-full space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Trading Accounts</h1>
                    <p className="text-muted-foreground text-sm">Manage your connected exchange accounts</p>
                </div>
                <CreateAccountForm />
            </div>

            {/* PAGINATION LOGIC */}
            {(() => {
                const page = pageParam ? parseInt(pageParam as string) : 1
                const pageSize = 6
                const totalPages = Math.ceil(accounts.length / pageSize)
                const paginatedAccounts = accounts.slice((page - 1) * pageSize, page * pageSize)

                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedAccounts.map((account) => (
                                <AccountCard key={account.id} account={{
                                    ...account,
                                    type: account.type || "Live",
                                    broker: account.broker || null,
                                }} />
                            ))}


                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-end p-4 gap-2 mt-4">
                                <Link
                                    href={page > 1 ? `/accounts?page=${page - 1}` : '#'}
                                    className={`px-4 py-2 text-sm rounded-lg border border-border bg-card text-muted-foreground ${page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-muted hover:text-foreground'}`}
                                >
                                    Previous
                                </Link>
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                                <Link
                                    href={page < totalPages ? `/accounts?page=${page + 1}` : '#'}
                                    className={`px-4 py-2 text-sm rounded-lg border border-border bg-card text-muted-foreground ${page >= totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-muted hover:text-foreground'}`}
                                >
                                    Next
                                </Link>
                            </div>
                        )}
                    </>
                )
            })()}
        </section>
    )
}
