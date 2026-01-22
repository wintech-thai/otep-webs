"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isAdminOpen, setIsAdminOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full w-full bg-white border-r border-slate-100">
      {/* 1. Sidebar Header (Logo) */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-50/50">
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-100">
             <Image src="/img/Otep.jpg" alt="Logo" fill className="object-cover" />
        </div>
        <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm leading-tight">{t.appTitle}</span>
            <span className="text-[11px] text-slate-400 font-medium">{t.subTitle}</span>
        </div>
      </div>

      {/* 2. Menu Items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <Link href="/dashboard">
            <SidebarItem 
                label={t.dashboard} 
                icon={<LayoutDashboard size={18} />} 
                active={pathname === "/dashboard"} 
            />
        </Link>

        {/* Administration Group */}
        <div>
            <button 
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <Settings size={18} className="group-hover:text-pink-500 transition-colors" />
                    {t.administration} 
                </div>
                {isAdminOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {isAdminOpen && (
                <div className="mt-1 ml-4 pl-4 space-y-1 border-l border-slate-100">
                    
                    <Link href="/dashboard/administration/custom-role">
                        <SidebarItem 
                            label={t.customRole} 
                            isSubmenu 
                            active={pathname === "/dashboard/administration/custom-role"} 
                        />
                    </Link>

                    <Link href="/dashboard/administration/api-keys">
                        <SidebarItem 
                            label={t.apiKeys} 
                            isSubmenu
                            active={pathname === "/dashboard/administration/api-keys"} 
                        />
                    </Link>

                    <Link href="/dashboard/administration/users">
                        <SidebarItem 
                            label={t.users} 
                            isSubmenu
                            active={pathname === "/dashboard/administration/users"} 
                        />
                    </Link>

                    {/* ซ่อน Audit Log */}
                    {/* <Link href="/dashboard/administration/audit-log">
                        <SidebarItem 
                            label={t.auditLog} 
                            isSubmenu
                            active={pathname === "/dashboard/administration/audit-log"} 
                        />
                    </Link> */}

                </div>
            )}
        </div>
      </div>

      <div className="p-6 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 text-center">
            {t.version}<br/> 
            {t.copyright} 
        </p>
      </div>
    </div>
  );
};

// --- Component SidebarItem ---
type SidebarItemProps = {
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    isSubmenu?: boolean;
};

const SidebarItem = ({ label, icon, active, isSubmenu }: SidebarItemProps) => (
    <div className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-all",
        active 
            ? "text-pink-600 bg-pink-50 font-medium shadow-sm shadow-pink-100" 
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
    )}>
        <div className="flex items-center gap-3">
            {icon && icon}
            {label}
        </div>
        
        {isSubmenu && (
            <ChevronRight size={14} className={cn("text-slate-300", active && "text-pink-500")} />
        )}
    </div>
);