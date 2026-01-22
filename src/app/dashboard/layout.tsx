import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900">
      
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] z-30">
        <Sidebar />
      </aside>

      <Header />
      
      <main className="pl-0 md:pl-[260px] pt-16 h-full w-full overflow-hidden flex flex-col">
        
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto h-full w-full flex flex-col overflow-hidden">
             {children}
        </div>
        
      </main>
    </div>
  );
}