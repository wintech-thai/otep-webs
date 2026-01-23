"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, ChevronLeft, ChevronRight, Filter,
  MoreHorizontal, Loader2, X, AlertTriangle,
  Check
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 
import { userApi, IUser } from "@/modules/administration/api/user.api";

export default function UsersPage() {
  const { t } = useLanguage() as { t: any };
  const pathname = usePathname(); 
  
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0); 
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Focus state for row highlighting
  const [focusedUserId, setFocusedUserId] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{id: string, action: 'Enable' | 'Disable'} | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchQuery, setSearchQuery] = useState(""); 

  const getUserId = (user: any, index: number): string => {
    const realId = user.orgUserId || user.userId || user.id || user.Id || user._id;
    return realId ? String(realId) : `fallback-${index}`;
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const orgId = localStorage.getItem("current_org") || "default";
      const [resList, resCount] = await Promise.all([
        userApi.getUsers({ orgId, offset: page * rowsPerPage, limit: rowsPerPage, fullTextSearch: searchQuery }),
        userApi.getUserCount({ orgId, fullTextSearch: searchQuery })
      ]);
      const data = (resList as any).data || resList || [];
      const total = typeof resCount === 'number' ? resCount : (resCount as any).data ?? 0;
      setUsers(Array.isArray(data) ? data : []);
      setTotalCount(Number(total));
      setFocusedUserId(null); 
    } catch (error) { 
      toast.error(t.failedToFetchUsers || "Failed to fetch users"); 
    } finally { 
      setIsLoading(false); 
    }
  }, [page, rowsPerPage, searchQuery, t]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleStatusClick = (id: string, currentStatus: string | null) => {
    const action = currentStatus === 'Disabled' ? 'Enable' : 'Disable';
    setStatusTarget({ id, action });
    setIsStatusModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) return;
    const orgId = localStorage.getItem("current_org") || "default";
    try {
      if (statusTarget.action === 'Enable') await userApi.enableUser(orgId, statusTarget.id);
      else await userApi.disableUser(orgId, statusTarget.id);
      toast.success(t.successStatusUpdate || `Successfully ${statusTarget.action}d user`);
      fetchUsers();
    } catch (error) { 
      toast.error(t.failedStatusUpdate || `Failed to change status`); 
    } finally { 
      setIsStatusModalOpen(false); 
      setStatusTarget(null); 
    }
  };

  const confirmBulkDelete = async () => {
    const orgId = localStorage.getItem("current_org") || "default";
    try {
      const realIds = Array.from(selectedIds).filter(id => !id.startsWith("fallback-"));
      await Promise.all(realIds.map(id => userApi.deleteUser(orgId, id)));
      toast.success(t.deleteSuccess || `Deleted successfully`);
      fetchUsers(); 
      setFocusedUserId(null);
    } catch (error) { 
      toast.error(t.deleteFailed || "Delete failed"); 
    } finally { 
      setIsDeleteModalOpen(false); 
      setSelectedIds(new Set()); 
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length && users.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map((u, i) => getUserId(u, i))));
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
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.searchUserPlaceholder || "Search by name, email..."}
                    className="w-full h-[40px] pl-4 pr-10 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all shadow-sm"
                />
            </div>
            <button onClick={handleSearch} className="h-[40px] w-[40px] bg-pink-400 hover:bg-pink-500 text-white rounded-lg flex items-center justify-center shadow-pink-100 transition-all active:scale-95">
                <Search size={18} />
            </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link 
              href={`${pathname}/create`} 
              className="flex items-center justify-center px-6 py-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
                {t.add || "Add"}
            </Link>
            <button 
              onClick={() => setIsDeleteModalOpen(true)} 
              disabled={selectedIds.size === 0} 
              className={`flex items-center justify-center px-6 py-2 text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 ${
                selectedIds.size > 0 
                ? "bg-[#ef5350] hover:bg-[#e53935] text-white" 
                : "bg-red-300 text-white cursor-not-allowed shadow-none"
              }`}
            >
                {t.delete || "Delete"} {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden min-h-0 relative">
        <div className="flex-1 overflow-auto no-scrollbar"> 
            <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-40 border-b border-slate-100">
                    <tr>
                        <th className="px-4 py-3 w-[50px] bg-slate-50">
                            <input type="checkbox" checked={users.length > 0 && selectedIds.size === users.length} onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 text-pink-500 accent-pink-500 cursor-pointer" />
                        </th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800">{t.username || "Username"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800">{t.email || "Email"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800">{t.tags || "Tags"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800">{t.customRole || "Custom Role"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800">{t.role || "Role"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800 text-center min-w-[120px]">{t.initialUser || "Initial User"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800 sticky right-[85px] bg-slate-50/90 z-40 text-center min-w-[100px]">{t.status || "Status"}</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-800 text-center sticky right-0 bg-slate-50/90 z-40 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)] min-w-[90px]">{t.action || "Action"}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr><td colSpan={9} className="p-20 text-center"><Loader2 className="animate-spin text-pink-400 mx-auto" size={32} /></td></tr>
                  ) : (
                    users.map((user, index) => {
                        const uid = getUserId(user, index);
                        const isSelected = selectedIds.has(uid);
                        const isStatusDisabled = user.userStatus === 'Disabled';
                        const isFocused = focusedUserId === uid;
                        const isInitial = user.isOrgInitialUser === "YES" || user.isOrgInitialUser === "true" || user.isOrgInitialUser === "1";
                        const isMenuOpen = openMenuId === uid;

                        return (
                        <tr 
                            key={uid} 
                            onClick={() => setFocusedUserId(uid)}
                            className={`transition-all group cursor-pointer border-l-4 ${
                                isSelected 
                                    ? "bg-pink-50/50 border-pink-400"
                                    : isFocused 
                                        ? "bg-pink-50 border-pink-300"
                                        : "hover:bg-slate-50/50 border-transparent"
                            }`}
                        >
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(uid)} className="w-4 h-4 rounded border-slate-300 text-pink-500 accent-pink-500 cursor-pointer" />
                            </td>
                            
                            <td className="px-4 py-3 text-sm font-medium text-pink-600 whitespace-nowrap">
                                {user.userName}
                            </td>

                            <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-[180px]">{user.userEmail || user.tmpUserEmail || "-"}</td>
                            <td className="px-4 py-3 text-[12px]">
                              {user.tags ? <span className="px-2 py-0.5 bg-pink-50 text-pink-600 font-bold rounded-full border border-pink-100">{user.tags}</span> : "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-pink-700 font-bold whitespace-nowrap">{user.customRoleName || "-"}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                                {(() => {
                                    const rList = user.rolesList ? user.rolesList.split(',') : (Array.isArray(user.roles) ? user.roles : []);
                                    return rList.map((r, i) => (
                                        <span key={i} className="inline-block px-2 py-0.5 bg-pink-500 text-white text-[10px] font-black uppercase rounded mr-1 mb-1 shadow-sm">{r.trim()}</span>
                                    ));
                                })()}
                            </td>

                            <td className="px-4 py-3 text-center">
                                {isInitial ? <Check className="text-green-500 mx-auto" size={20} strokeWidth={3} /> : <X className="text-red-500 mx-auto" size={20} strokeWidth={3} />}
                            </td>
                            
                            <td className={`px-4 py-3 text-center sticky right-[85px] z-30 transition-colors ${
                                isSelected ? "bg-[#fff5f6]" : isFocused ? "bg-pink-50" : "bg-white group-hover:bg-slate-50"
                            }`}>
                                <span className="text-[13.5px] font-medium text-slate-900 capitalize">
                                    {user.userStatus === 'Pending' ? (t.pending || "Pending") : 
                                     user.userStatus === 'Disabled' ? (t.disabled || "Disabled") : 
                                     (t.active || "Active")}
                                </span>
                            </td>
                            
                            <td className={`px-4 py-3 text-center sticky right-0 transition-colors shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] ${isMenuOpen ? "z-50" : "z-30"} ${
                                isSelected ? "bg-[#fff5f6]" : isFocused ? "bg-pink-50" : "bg-white group-hover:bg-slate-50"
                            }`}>
                                <div onClick={(e) => e.stopPropagation()} className="relative">
                                    <button onClick={() => setOpenMenuId(isMenuOpen ? null : uid)} className="p-1.5 px-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
                                        <MoreHorizontal size={16} />
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-8 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-slate-100 z-[60] py-1.5 text-left animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                                            <button disabled={isStatusDisabled} onClick={() => handleStatusClick(uid, user.userStatus)} className={`flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium w-full transition-colors ${isStatusDisabled ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"}`}>{t.disableUser || "Disable User"}</button>
                                            <button disabled={!isStatusDisabled} onClick={() => handleStatusClick(uid, user.userStatus)} className={`flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium w-full transition-colors ${!isStatusDisabled ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"}`}>{t.enableUser || "Enable User"}</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                        );
                    })
                  )}
                </tbody>
            </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-6 text-[14px] text-slate-500 bg-white shrink-0 z-20">
            <div className="flex items-center gap-2">
                <span className="font-medium text-slate-400">{t.rowsPerPage || "Rows per page"}:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="bg-slate-50 px-2 py-1 rounded-lg border-none font-medium text-slate-700 outline-none cursor-pointer">
                    <option value={25}>25</option><option value={50}>50</option><option value={100}>100</option><option value={200}>200</option>
                </select>
            </div>
            <span className="font-medium text-slate-500">{totalCount > 0 ? `${startRow}-${endRow} ${t.of || "of"} ${totalCount}` : "0-0 of 0"}</span>
            <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg bg-slate-50 hover:bg-pink-50 disabled:opacity-30 text-slate-400 hover:text-pink-500"><ChevronLeft size={18} /></button>
                <button onClick={() => setPage(p => p + 1)} disabled={totalCount === 0 || endRow >= totalCount} className="p-2 rounded-lg bg-slate-50 hover:bg-pink-50 disabled:opacity-30 text-slate-400 hover:text-pink-500"><ChevronRight size={18} /></button>
            </div>
        </div>
      </div>

      {/* Modals: I18n */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-800">{statusTarget?.action === 'Enable' ? t.enableUser : t.disableUser}</h3>
                    <button onClick={() => setIsStatusModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={20} /></button>
                </div>
                <div className="px-6 py-8 text-slate-600 text-base leading-relaxed">
                    {t.confirmStatusChange || "Are you sure you want to change status?"}
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button onClick={() => setIsStatusModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-700 bg-[#f1f1f1] rounded-xl hover:bg-slate-200 transition-colors">{t.cancel || "Cancel"}</button>
                    <button onClick={confirmStatusChange} className={`px-10 py-2 text-sm font-black text-white rounded-xl shadow-lg transition-all active:scale-95 ${statusTarget?.action === 'Disable' ? 'bg-red-600 hover:bg-red-700' : 'bg-pink-500 hover:bg-pink-600'}`}>{t.ok || "OK"}</button>
                </div>
            </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><AlertTriangle className="text-[#ef5350]" size={20} /> {t.confirmation || "Confirmation"}</h3>
                    <button onClick={() => setIsDeleteModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={20} /></button>
                </div>
                <div className="px-6 py-8 text-slate-600 text-base leading-relaxed">
                  {t.confirmDeleteMessage || "Are you sure you want to delete?"} <span className="font-black text-red-600">{selectedIds.size}</span> {t.usersSelected || "user(s)"}?
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">{t.cancel || "Cancel"}</button>
                    <button onClick={confirmBulkDelete} className="px-8 py-2 text-sm font-black text-white bg-[#ef5350] hover:bg-[#e53935] rounded-xl shadow-lg active:scale-95">{t.delete || "Delete"}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}