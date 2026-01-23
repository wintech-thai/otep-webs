"use client";

import { useState } from "react";
import { User, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { authApi } from "@/modules/auth/api/auth.api";
import { Toaster } from "@/components/ui/sonner";

// UI Components (Shadcn)
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// Dialog Components
import { ProfileDialog } from "@/modules/profile/components/profile-dialog";
import { ChangePasswordDialog } from "@/modules/profile/components/change-password-dialog";
import { MobileSidebar } from "@/components/layout/mobile-sidebar"; 

export const Header = () => {
  const { language, setLanguage, t } = useLanguage() as { language: string; setLanguage: any; t: any };
  
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const handleLogout = async () => {
    authApi.logout.api("temp").catch(err => console.warn("Backend logout ignored:", err));
    await authApi.logout.clearCookies(); 
    localStorage.removeItem("user_info");
    window.location.replace("/login");
  };

  return (
    <header className={cn(
        "h-16 bg-white border-b border-slate-100 fixed top-0 right-0 z-40 transition-[width] duration-200",
        "w-full md:w-[calc(100%-260px)]", 
        "flex items-center justify-between md:justify-end px-4 md:px-6"
    )}>
      
      <Toaster position="top-center" richColors theme="light" />

      <MobileSidebar />
      
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* --- Language Selector --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all outline-none">
              <span className="font-bold text-slate-700 text-sm">{t.languageSub}</span>
              <span className="text-sm text-slate-600 font-medium hidden sm:inline">{t.languageName}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-2xl border-slate-100">
            <DropdownMenuItem onClick={() => setLanguage("EN")} className="flex justify-between items-center rounded-lg py-2.5 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xs bg-slate-100 px-1.5 py-0.5 rounded">US</span>
                <span className="text-sm font-medium">English</span>
              </div>
              {language === "EN" && <Check size={16} className="text-blue-500" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("TH")} className="flex justify-between items-center rounded-lg py-2.5 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xs bg-slate-100 px-1.5 py-0.5 rounded">TH</span>
                <span className="text-sm font-medium">ภาษาไทย</span>
              </div>
              {language === "TH" && <Check size={16} className="text-blue-500" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

        {/* --- Profile Dropdown (ลบไอคอนข้างในออกแล้ว) --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all outline-none">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#e0f2f1] border border-[#b2dfdb] text-[#00897b]">
                <User size={18} />
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-2xl border-slate-100">
            <DropdownMenuItem 
              onClick={() => setShowProfile(true)} 
              className="px-4 py-2.5 rounded-lg cursor-pointer font-bold text-slate-700"
            >
              {t.menuProfile}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowChangePwd(true)} 
              className="px-4 py-2.5 rounded-lg cursor-pointer font-bold text-slate-700"
            >
              {t.changePasswordTitle}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="px-4 py-2.5 rounded-lg cursor-pointer font-bold text-red-600 bg-red-50/30 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
            >
              {t.menuLogout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog Components */}
      <ProfileDialog open={showProfile} onOpenChange={setShowProfile} />
      <ChangePasswordDialog open={showChangePwd} onOpenChange={setShowChangePwd} />

    </header>
  );
};