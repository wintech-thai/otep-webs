"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

export const Header = () => {
  const { language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-end px-6 fixed top-0 right-0 w-[calc(100%-260px)] z-20">
      
      <div className="flex items-center gap-4">
        
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border border-transparent",
                "hover:bg-slate-50 hover:border-slate-200",
                isLangOpen && "bg-slate-50 border-slate-200"
            )}
          >
            <span className="font-bold text-slate-700 text-sm">{language === "EN" ? "US" : "TH"}</span>
            <span className="text-sm text-slate-600 font-medium">
                {language === "EN" ? "English" : "ภาษาไทย"}
            </span>
            <ChevronDown size={16} className={cn("text-slate-400 transition-transform duration-200", isLangOpen && "rotate-180")} />
          </button>

          {isLangOpen && (
            <div className="absolute top-full right-0 mt-2 w-[180px] bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-1.5 animate-in fade-in zoom-in-95 duration-200 z-50">
                <LanguageItem 
                    code="TH" 
                    label="ภาษาไทย" 
                    subLabel="Thai" 
                    isActive={language === "TH"} 
                    onClick={() => { 
                        setLanguage("TH"); 
                        setIsLangOpen(false); 
                    }} 
                />
                <LanguageItem 
                    code="US" 
                    label="English" 
                    subLabel="English" 
                    isActive={language === "EN"} 
                    onClick={() => { 
                        setLanguage("EN"); 
                        setIsLangOpen(false); 
                    }} 
                />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

        <div className="relative" ref={profileRef}>
            {/* ปุ่ม Avatar */}
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all outline-none",
                    "bg-[#e0f2f1] border border-[#b2dfdb] text-[#00897b]",
                    "hover:shadow-md hover:scale-105 active:scale-95",
                    isProfileOpen && "ring-2 ring-offset-2 ring-[#b2dfdb]"
                )}
            >
                <User size={20} />
            </button>

            {/* เมนู Profile Dropdown */}
            {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-[200px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden">
                    
                    <div className="px-1 space-y-0.5">
                        <MenuItem label="Profile" onClick={() => console.log("Go to Profile")} />
                        <MenuItem label="Change Password" onClick={() => console.log("Go to Change Password")} />
                    </div>

                    <div className="h-[1px] bg-slate-100 my-2 mx-0"></div>

                    <div className="px-1">
                        <MenuItem label="Logout" onClick={() => console.log("Logout")} isDanger />
                    </div>
                </div>
            )}
        </div>

      </div>
    </header>
  );
};

// --- Sub Components ---

const LanguageItem = ({ code, label, subLabel, isActive, onClick }: any) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left group",
            isActive ? "bg-slate-50" : "hover:bg-slate-50"
        )}
    >
        <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 text-sm w-5">{code}</span>
            <div className="flex flex-col leading-none">
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-500 mt-0.5">{subLabel}</span>
            </div>
        </div>
        {isActive && <Check size={16} className="text-blue-500" />}
    </button>
);

const MenuItem = ({ label, onClick, isDanger }: { label: string, onClick: () => void, isDanger?: boolean }) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-full text-left px-4 py-2.5 text-[14px] transition-colors rounded-lg mx-auto block w-[96%]",
            isDanger 
                ? "text-red-600 hover:bg-red-50 font-medium" 
                : "text-slate-700 hover:bg-slate-50 font-medium"
        )}
    >
        {label}
    </button>
);