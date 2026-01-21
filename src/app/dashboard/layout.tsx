import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900">
      
      {/* ✅ แก้ไข: ใช้ aside เป็นตัวคุมตำแหน่งและความกว้างเฉพาะจอคอม (md:) */}
      {/* บนมือถือ aside ตัวนี้จะถูก hidden ไป ไม่เบียดหน้าจอ */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] z-30">
        <Sidebar />
      </aside>

      <Header />
      
      {/* ✅ ใช้ pl-0 บนมือถือ และ md:pl-[260px] บนจอคอม */}
      <main className="pl-0 md:pl-[260px] pt-16 h-full w-full overflow-y-auto scroll-smooth">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-full">
             {children}
        </div>
      </main>
    </div>
  );
}