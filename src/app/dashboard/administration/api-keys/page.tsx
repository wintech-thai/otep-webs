"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export default function ApiKeysPage() {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { t } = useLanguage();

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col"> 
      
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        
        {/* Left: Search Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
            <div className="hidden md:flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 min-w-[140px] cursor-pointer hover:bg-slate-50 transition-colors">
                <Filter size={16} />
                <span>{t.fullTextSearch}</span>
                <ChevronRight size={14} className="ml-auto rotate-90 text-slate-400" />
            </div>

            <div className="relative flex-1">
                <input 
                    type="text" 
                    placeholder={t.searchApiKeyPlaceholder} 
                    className="w-full h-[42px] pl-4 pr-10 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-50 focus:border-pink-300 transition-all"
                />
            </div>

            <button className="h-[42px] w-[42px] bg-pink-400 hover:bg-pink-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm shadow-pink-100">
                <Search size={20} />
            </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-pink-100 transition-all active:scale-95">
                <Plus size={18} strokeWidth={2.5} />
                {t.add}
            </button>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#ef5350] hover:bg-[#e53935] text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-200 transition-all active:scale-95">
                <Trash2 size={18} strokeWidth={2.5} />
                {t.delete}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden relative">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="p-4 w-[50px]">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-pink-400 focus:ring-pink-100" disabled />
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.keyName}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.description}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.customRoleTh}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.rolesTh}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.status}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800 text-right">{t.action}</th>
                    </tr>
                </thead>
            </table>
        </div>

        {/* Coming Soon Message */}
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
            <h3 className="text-xl font-bold text-slate-300 tracking-widest uppercase">
                {t.comingSoon}
            </h3>
            <div className="flex gap-1.5 mt-3">
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-6 text-sm text-slate-500 bg-white absolute bottom-0 w-full">
            <div className="flex items-center gap-2">
                <span>{t.rowsPerPage}:</span>
                <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-transparent border-none font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none"
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>
            </div>
            
            <span>1-0 of 0</span>

            <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-full hover:bg-pink-50 text-slate-500 hover:text-pink-500 transition-colors active:bg-pink-100">
                    <ChevronLeft size={20} />
                </button>
                <button className="p-1.5 rounded-full hover:bg-pink-50 text-slate-500 hover:text-pink-500 transition-colors active:bg-pink-100">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}