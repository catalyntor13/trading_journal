export default function HeaderNav(){
    return (
        <header className="border-b border-slate-800 p-6  bg-slate-950 text-slate-300 backdrop-blur-sm ">
           
           <div className="flex justify-between  items-center">
            <div className="flex items-nceter">
                 <span>Dashboard</span>
            <span className="mx-1">/</span>
            <span>CurrentPage</span>
            </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm border-2 border-slate-900 cursor-pointer">
              AD
            </div>
           
           </div>
        </header>
    )
}