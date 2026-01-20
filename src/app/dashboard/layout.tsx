import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900">
      
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <Header />
      
      <main className="pl-0 md:pl-[260px] pt-16 h-full w-full overflow-y-auto scroll-smooth transition-all duration-200">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-full">
            {children}
        </div>
      </main>
    </div>
  );
}