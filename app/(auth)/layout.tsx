export default function AuthenticationPage({children,} : {children: React.ReactNode,}){


  return (
   <div className="flex min-h-screen items-center justify-center bg-slate-950 py-20 px-6">
       {/* Aici va fi injectată pagina de Login sau Register */}
       {children}
    </div>
  )
}