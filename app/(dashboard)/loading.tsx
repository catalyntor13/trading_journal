import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <section className="p-6 space-y-8 min-h-full w-full animate-in fade-in duration-500">

            {/* HEADER SKELETON */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48 bg-slate-800/60 rounded-lg" />
                    <Skeleton className="h-4 w-64 bg-slate-800/40 rounded" />
                </div>
                <Skeleton className="h-10 w-40 bg-slate-800/60 rounded-xl" />
            </div>

            {/* STATS CARDS SKELETON ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0A101C] border border-slate-800/60 shadow-sm relative overflow-hidden h-32 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-24 bg-slate-800/40 rounded" />
                            <Skeleton className="h-10 w-10 bg-slate-800/60 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-32 bg-slate-800/60 rounded" />
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT SKELETON */}
            <div className="rounded-2xl bg-[#0A101C] border border-slate-800/60 p-6 min-h-[400px]">
                <div className="flex gap-4 border-b border-slate-800/60 pb-4 mb-6">
                    <Skeleton className="h-10 w-24 bg-slate-800/60 rounded-lg" />
                    <Skeleton className="h-10 w-24 bg-slate-800/40 rounded-lg" />
                    <Skeleton className="h-10 w-24 bg-slate-800/40 rounded-lg" />
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-12 w-full bg-slate-800/40 rounded-lg" />
                    <Skeleton className="h-12 w-full bg-slate-800/40 rounded-lg" />
                    <Skeleton className="h-12 w-[90%] bg-slate-800/40 rounded-lg" />
                    <Skeleton className="h-24 w-full bg-slate-800/20 rounded-xl mt-8" />
                </div>
            </div>

        </section>
    )
}
