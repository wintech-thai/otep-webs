"use client"; 
import { Users, ShieldCheck, Activity } from "lucide-react";
import { useLanguage } from "@/providers/language-provider"; 

export default function DashboardPage() {
  const { t } = useLanguage(); 

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t.overview}</h1>
        <p className="text-slate-500">{t.welcomeMessage}</p>
      </div>

      {/* Stats Cards Example */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title={t.statTotalUsers} 
            value="2,543" 
            icon={<Users className="text-blue-500" />} 
        />
        <StatCard 
            title={t.statActiveSessions} 
            value="132" 
            icon={<Activity className="text-green-500" />} 
        />
        <StatCard 
            title={t.statAuditLogs} 
            value="450+" 
            icon={<ShieldCheck className="text-pink-500" />} 
        />
      </div>
      
      {/* Content Example */}
      <div className="bg-white rounded-xl border border-slate-100 p-8 h-[400px] shadow-sm flex items-center justify-center text-slate-300">
           {t.comingSoon} ...
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            {icon}
        </div>
    </div>
);