"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Edit,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 

import { userApi, IUser } from "../api/user.api";

export default function UsersPage() {
  const { t } = useLanguage() as { t: any };
  const pathname = usePathname(); 
  
  // States
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination & Filter
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Fetch Data ---
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const orgId = localStorage.getItem("current_org") || "default";
      
      const res = await userApi.getUsers({
        orgId,
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        fullTextSearch: searchTerm
      });
      
      const data = (res as any).data || res || [];
      setUsers(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const orgId = localStorage.getItem("current_org") || "default";
      await userApi.deleteUser(orgId, userId);
      toast.success("User deleted successfully");
      fetchUsers(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col"> 
      
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        
        {/* Left: Search */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
            <div className="hidden md:flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 min-w-[140px] cursor-pointer hover:bg-slate-50 transition-colors">
                <Filter size={16} />
                <span>{t.fullTextSearch || "Search"}</span>
                <ChevronRight size={14} className="ml-auto rotate-90 text-slate-400" />
            </div>

            <div className="relative flex-1">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchUserPlaceholder || "Search by name, email..."}
                    className="w-full h-[42px] pl-4 pr-10 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all"
                />
            </div>

            <button 
              onClick={fetchUsers}
              className="h-[42px] w-[42px] bg-pink-400 hover:bg-pink-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm shadow-pink-100"
            >
                <Search size={20} />
            </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            
            <Link 
              href={`${pathname}/create`} 
              className="flex items-center gap-2 px-5 py-2.5 bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-pink-100 transition-all active:scale-95"
            >
                <Plus size={18} strokeWidth={2.5} />
                {t.add || "Add User"}
            </Link>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#ef5350] hover:bg-[#e53935] text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-200 transition-all active:scale-95">
                <Trash2 size={18} strokeWidth={2.5} />
                {t.delete || "Delete"}
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden relative">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur z-10">
                    <tr className="border-b border-slate-100">
                        <th className="p-4 w-[50px]">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-pink-400 focus:ring-pink-100" />
                        </th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.username || "Username"}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.email || "Email"}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.tags || "Tags"}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.rolesTh || "Roles"}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800">{t.status || "Status"}</th>
                        <th className="p-4 text-sm font-semibold text-slate-800 text-right">{t.action || "Action"}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-pink-400" size={32} />
                          <span>Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-400">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.userId} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-pink-400 focus:ring-pink-100" />
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-700">{user.userName}</td>
                        <td className="p-4 text-sm text-slate-600">{user.userEmail || user.tmpUserEmail || "-"}</td>
                        <td className="p-4 text-sm text-slate-600">
                          {user.tags ? (
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-500">{user.tags}</span>
                          ) : "-"}
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {user.rolesList ? user.rolesList.split(',').slice(0, 2).map((r, i) => (
                             <span key={i} className="inline-block px-2 py-0.5 bg-pink-50 text-pink-600 text-xs rounded mr-1 border border-pink-100">
                               {r.trim()}
                             </span>
                          )) : "-"}
                          {user.rolesList && user.rolesList.split(',').length > 2 && (
                            <span className="text-xs text-slate-400">+{user.rolesList.split(',').length - 2} more</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`${pathname}/${user.userId}/update`} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-pink-600 inline-block">
                              <Edit size={16} />
                            </Link>
                            <button 
                              onClick={() => handleDeleteUser(user.userId)}
                              className="p-1.5 hover:bg-red-100 rounded text-slate-500 hover:text-red-500" title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-6 text-sm text-slate-500 bg-white sticky bottom-0">
            <div className="flex items-center gap-2">
                <span>{t.rowsPerPage || "Rows per page"}:</span>
                <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-transparent border-none font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none"
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            
            <span>
              {(page * rowsPerPage) + 1}-{Math.min((page + 1) * rowsPerPage, Math.max(users.length, 1))} of {totalCount || users.length || 0}
            </span>

            <div className="flex items-center gap-1">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-full hover:bg-pink-50 text-slate-500 hover:text-pink-500 transition-colors disabled:opacity-30"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-full hover:bg-pink-50 text-slate-500 hover:text-pink-500 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}