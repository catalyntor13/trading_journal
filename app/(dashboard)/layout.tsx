import AsideNav from "@/components/dashboard/aside-nav";
import HeaderNav from "@/components/dashboard/header-nav";
import { auth } from "@/lib/auth"; // Importăm auth de SERVER
import { headers } from "next/headers"; // Necesar pentru a citi cookie-urile
import { redirect } from "next/navigation";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 1. Initiem sesiunea din auth Server
  const session = await auth.api.getSession({
    headers: await headers() 
  });

  // 2. Dacă nu există sesiune, dăm KICK către homepage sau login
  if (!session) {
    redirect("/login"); // sau redirect("/login")
  }

  return (
    <div className="flex h-screen ">
      {/* Sidebar fix în stânga */}
       <AsideNav/>
        
      {/* Zona principală de conținut */}
      <main className="flex-1 overflow-y-auto ">

         <HeaderNav/>

        {children}
      </main>
    </div>
  );
}