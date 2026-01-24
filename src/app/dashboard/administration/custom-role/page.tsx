"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, ChevronLeft, ChevronRight, Filter,
  MoreHorizontal, Loader2, X, AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { customRoleApi, ICustomRole } from "@/modules/administration/api/custom-role.api";

export default function CustomRolePage() {
  const { t } = useLanguage() as { t: any };
  const pathname = usePathname();

  // --- States ---
  const [roles, setRoles] = useState<ICustomRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // UI States
  const [focusedRoleId, setFocusedRoleId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Search & Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const orgId = localStorage.getItem("current_org") || "default";
      const [resList, resCount] = await Promise.all([
        customRoleApi.getCustomRoles({ orgId, offset: page * rowsPerPage, limit: rowsPerPage, fullTextSearch: searchQuery }),
        customRoleApi.getCustomRoleCount({ orgId, fullTextSearch: searchQuery })
      ]);
      const data = (resList as any).data || resList || [];
      const total = typeof resCount === 'number' ? resCount : (resCount as any).data ?? 0;
      setRoles(Array.isArray(data) ? data : []);
      setTotalCount(Number(total));
      setFocusedRoleId(null);
    } catch (error) { 
      toast.error("Failed to fetch custom roles"); 
    } finally { 
      setIsLoading(false); 
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleSearch = () => { setPage(0); setSearchQuery(searchTerm); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const confirmBulkDelete = async () => {
    const orgId = localStorage.getItem("current_org") || "default";
    try {
      if (deleteTarget === "BULK" && selectedIds.size > 0) {
        const ids = Array.from(selectedIds);
        await Promise.all(ids.map(id => customRoleApi.deleteCustomRole(orgId, id)));
        toast.success(`Deleted ${ids.length} roles successfully`);
        setSelectedIds(new Set());
        fetchRoles();
      }
    } catch (error) { 
      toast.error("Failed to delete roles"); 
    } finally { 
      setDeleteTarget(null); 
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === roles.length && roles.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(roles.map(r => r.roleId)));
  };

  const toggleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedIds(newSet);
  };

  const startRow = totalCount === 0 ? 0 : (page * rowsPerPage) + 1;
  const endRow = Math.min((page + 1) * rowsPerPage, totalCount);

  return (
    <div className="flex-1 flex flex-col space-y-4 overflow-hidden min-h-0"> 
      
      {/* --- Toolbar --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 min-w-[140px] cursor-pointer hover:bg-slate-50">
                <Filter size={16} /> <span>{t.fullTextSearch || "Search"}</span>
                <ChevronRight size={14} className="ml-auto rotate-90 text-slate-400" />
            </div>
            <div className="relative flex-1">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.searchRolePlaceholder || "Search role..."} className="w-full h-[40px] pl-4 pr-10 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all shadow-sm" />
            </div>
            <button onClick={handleSearch} className="h-[40px] w-[40px] bg-pink-400 hover:bg-pink-500 text-white rounded-lg flex items-center justify-center shadow-pink-100 transition-all active:scale-95">
                <Search size={18} />
            </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link href={`${pathname}/create`} className="flex items-center justify-center px-6 py-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95">{t.add || "Add"}</Link>
            <button onClick={() => setDeleteTarget("BULK")} disabled={selectedIds.size === 0} className={`flex items-center justify-center px-6 py-2 text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 ${selectedIds.size > 0 ? "bg-[#ef5350] hover:bg-[#e53935] text-white" : "bg-red-300 text-white cursor-not-allowed shadow-none"}`}>
                {t.delete || "Delete"} {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden min-h-0 relative">
        <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-40 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-3 w-[50px] bg-slate-50">
                            <input type="checkbox" checked={roles.length > 0 && selectedIds.size === roles.length} onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 text-pink-500 accent-pink-500 cursor-pointer transition-all" />
                        </th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-800 w-[25%]">{t.roleName || "Role Name"}</th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-800 w-[35%]">{t.description || "Description"}</th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-800 w-[25%]">{t.tags || "Tags"}</th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-800 text-center sticky right-0 bg-slate-50/90 z-40 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)] w-[100px]">{t.action || "Action"}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                        <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin text-pink-400 mx-auto" size={32} /></td></tr>
                    ) : roles.length === 0 ? (
                        <tr><td colSpan={5} className="p-20 text-center text-slate-400">No roles found</td></tr>
                    ) : (
                        roles.map((role) => {
                            const isFocused = focusedRoleId === role.roleId;
                            const isSelected = selectedIds.has(role.roleId);

                            return (
                                <tr key={role.roleId} onClick={() => setFocusedRoleId(role.roleId)} className={`transition-all group cursor-pointer border-l-4 ${isSelected ? "bg-pink-50/50 border-pink-400" : isFocused ? "bg-pink-50 border-pink-300" : "hover:bg-slate-50/50 border-transparent"}`}>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(role.roleId)} className="w-4 h-4 rounded border-slate-300 text-pink-500 accent-pink-500 cursor-pointer transition-all" />
                                    </td>
                                    <td className="px-6 py-4"><div className="text-[14.5px] font-medium text-pink-600 hover:underline">{role.roleName}</div></td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{role.roleDescription || "-"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {role.tags ? role.tags.split(',').map((tag, i) => (
                                                <span key={i} className="inline-block px-2 py-0.5 bg-pink-50 text-pink-600 text-xs font-bold rounded-full border border-pink-100">{tag.trim()}</span>
                                            )) : <span className="text-slate-400 text-xs">-</span>}
                                        </div>
                                    </td>
                                    
                                    <td className={`px-6 py-4 text-center sticky right-0 transition-colors shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] z-30 ${isSelected ? "bg-[#fff5f6]" : isFocused ? "bg-pink-50" : "bg-white group-hover:bg-slate-50"}`}>
                                        <div onClick={(e) => e.stopPropagation()} className="relative flex justify-center">
                                            <button className="p-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-400 shadow-sm cursor-default">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>

        {/* --- Footer Pagination --- */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-6 text-[14px] text-slate-500 bg-white shrink-0 z-20">
            <div className="flex items-center gap-2">
                <span className="font-medium text-slate-400">{t.rowsPerPage || "Rows per page"}:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="bg-slate-50 px-2 py-1 rounded-lg border-none font-medium text-slate-700 outline-none cursor-pointer">
                    <option value={25}>25</option><option value={50}>50</option><option value={100}>100</option><option value={200}>200</option>
                </select>
            </div>
            <span className="font-medium text-slate-500">{totalCount > 0 ? `${startRow}-${endRow} of ${totalCount}` : "0-0 of 0"}</span>
            <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg bg-slate-50 hover:bg-pink-50 disabled:opacity-30 text-slate-400 hover:text-pink-500"><ChevronLeft size={18} /></button>
                <button onClick={() => setPage(p => p + 1)} disabled={totalCount === 0 || endRow >= totalCount} className="p-2 rounded-lg bg-slate-50 hover:bg-pink-50 disabled:opacity-30 text-slate-400 hover:text-pink-500"><ChevronRight size={18} /></button>
            </div>
        </div>
      </div>

      {deleteTarget === "BULK" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><AlertTriangle className="text-[#ef5350]" size={20} /> Confirmation</h3>
                    <button onClick={() => setDeleteTarget(null)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={20} /></button>
                </div>
                <div className="px-6 py-8 text-slate-600 text-base leading-relaxed">Are you sure you want to delete {selectedIds.size} selected role(s)?</div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button onClick={() => setDeleteTarget(null)} className="px-6 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                    <button onClick={confirmBulkDelete} className="px-8 py-2 text-sm font-black text-white bg-[#ef5350] hover:bg-[#e53935] rounded-xl shadow-lg active:scale-95">Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}