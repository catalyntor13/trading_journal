import AsideNav from "@/components/dashboard/aside-nav";
import { auth } from "@/lib/auth"; // Importăm auth de SERVER
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TopNav from "@/components/dashboard/top-nav";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 1. Initiem sesiunea din auth Server
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // 1. Verificăm întâi dacă e logat
  if (!session) {
    redirect("/login");
  }

  // 2. Verificam accesul conform planului de subscribe
  const hasAccess = session?.user.plan === "pro" || session?.user.plan === "lifetime";

  if (!hasAccess) {
    redirect("/subscribe");
  }

  // 2. Dacă nu există sesiune, dăm KICK către homepage sau login


  return (
    <div className="flex h-screen bg-[#060B14] text-slate-200 font-sans p-4 md:p-6 gap-6">
      {/* Sidebar fix în stânga */}
      <AsideNav />

      {/* Zona principală de conținut */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        <TopNav user={session.user} />

        {children}
      </main>
    </div>
  );
}