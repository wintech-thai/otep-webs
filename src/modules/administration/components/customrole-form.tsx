"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { 
  Loader2, ArrowLeft, X, AlertTriangle, 
  ChevronDown, ChevronRight, Search
} from "lucide-react";
import { toast } from "sonner"; 

import { customRoleSchema, CustomRoleSchemaType } from "../schema/custom-role.schema";
import { customRoleApi } from "../api/custom-role.api"; 
import { useLanguage } from "@/providers/language-provider";

interface IApiPermission {
  controllerName: string;
  apiName: string;
  isAllowed: boolean;
}

interface IPermissionGroup {
  controllerName: string;
  apiPermissions: IApiPermission[];
}

export const CustomRoleForm = () => {
  const { t } = useLanguage() as { t: any };
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [permissionGroups, setPermissionGroups] = useState<IPermissionGroup[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [permissionSearch, setPermissionSearch] = useState("");
  
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const form = useForm<CustomRoleSchemaType>({
    resolver: zodResolver(customRoleSchema),
    defaultValues: { roleName: "", roleDescription: "", tags: "", permissionIds: [] },
  });

  const { errors, isSubmitted, isDirty } = form.formState;

  const getPermissionId = (controller: string, apiName: string) => `${controller}:${apiName}`;

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsFetching(true);
      try {
        const orgId = localStorage.getItem("current_org") || "default";
        const res: any = await customRoleApi.getInitialPermissions(orgId);
        
        let rawGroups: IPermissionGroup[] = [];
        if (res?.permissions && Array.isArray(res.permissions)) rawGroups = res.permissions;
        else if (res?.data?.permissions && Array.isArray(res.data.permissions)) rawGroups = res.data.permissions;
        else if (Array.isArray(res)) rawGroups = res;

        if (rawGroups.length > 0) {
            const sorted = rawGroups.sort((a, b) => (a.controllerName || "").localeCompare(b.controllerName || ""));
            setPermissionGroups(sorted);
            const allGroupNames = new Set(sorted.map(g => g.controllerName));
            setExpandedGroups(allGroupNames);
        }
      } catch (error) {
        toast.error(t.msgPermissionError || "Failed to load permissions");
      } finally {
        setIsFetching(false);
      }
    };
    fetchPermissions();
  }, [t.msgPermissionError]);

  // --- 2. Sync Tags ---
  useEffect(() => {
    form.setValue("tags", tagsList.join(","), { shouldValidate: isSubmitted, shouldDirty: true });
  }, [tagsList, form, isSubmitted]);

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tagsList.includes(trimmed)) {
        setTagsList(prev => [...prev, trimmed]);
        setTagInput("");
    }
  };

  // --- 3. Filter Logic (Search) ---
  const filteredGroups = useMemo(() => {
    if (!permissionSearch) return permissionGroups;
    const lowerSearch = permissionSearch.toLowerCase();
    return permissionGroups.map(group => {
        const groupMatches = group.controllerName.toLowerCase().includes(lowerSearch);
        const matchingChildren = group.apiPermissions.filter(p => p.apiName.toLowerCase().includes(lowerSearch));
        if (groupMatches) return group; 
        if (matchingChildren.length > 0) return { ...group, apiPermissions: matchingChildren };
        return null;
    }).filter(Boolean) as IPermissionGroup[];
  }, [permissionGroups, permissionSearch]);

  // --- 4. Selection Logic ---
  const toggleGroup = (group: IPermissionGroup) => {
    const newSet = new Set(selectedPermissionIds);
    const idsInGroup = group.apiPermissions.map(p => getPermissionId(group.controllerName, p.apiName));
    const allSelected = idsInGroup.every(id => newSet.has(id));
    if (allSelected) idsInGroup.forEach(id => newSet.delete(id));
    else idsInGroup.forEach(id => newSet.add(id));
    setSelectedPermissionIds(newSet);
    form.setValue("permissionIds", Array.from(newSet));
  };

  const togglePermission = (id: string) => {
    const newSet = new Set(selectedPermissionIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedPermissionIds(newSet);
    form.setValue("permissionIds", Array.from(newSet));
  };

  const toggleExpand = (groupName: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(groupName)) newSet.delete(groupName); else newSet.add(groupName);
    setExpandedGroups(newSet);
  };

  // --- 5. Submit ---
  const onSubmit = async (data: CustomRoleSchemaType) => {
    setIsLoading(true);
    try {
        const orgId = localStorage.getItem("current_org") || "default";
        const payload = {
            roleName: data.roleName,
            roleDescription: data.roleDescription,
            tags: data.tags, 
            permissionIds: Array.from(selectedPermissionIds)
        };
        await customRoleApi.addCustomRole(orgId, payload);
        toast.success(t.msgRoleSuccess || "Custom role created successfully");
        router.back();
    } catch (error) {
        toast.error(t.msgRoleError || "Failed to create role");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty || selectedPermissionIds.size > 0) setShowLeaveModal(true);
    else router.back();
  };

  if (isFetching) return <div className="h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;

  return (
    <div className="flex-col h-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative flex">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
            <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-full transition">
                <ArrowLeft size={22} className="text-slate-500" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {t.createRole || "Create Custom Role"}
            </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 no-scrollbar">
        <form className="space-y-6 w-full mx-auto">
            <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                    {t.roleInformation || "Role Information"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-slate-700 ml-1">
                            {t.roleName || "Role Name"} <span className="text-red-500">*</span>
                        </label>
                        <input 
                            {...form.register("roleName")}
                            className={`w-full border rounded-lg px-3 py-2.5 text-[15px] outline-none transition-all focus:ring-2 ${errors.roleName ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-pink-400 focus:ring-pink-200"}`}
                            placeholder={t.enterRoleName || "Enter role name"} 
                        />
                        {errors.roleName && <span className="text-xs text-red-500">{errors.roleName.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-slate-700 ml-1">
                            {t.description || "Description"} <span className="text-red-500">*</span>
                        </label>
                        <input 
                            {...form.register("roleDescription")}
                            className={`w-full border rounded-lg px-3 py-2.5 text-[15px] outline-none transition-all focus:ring-2 ${errors.roleDescription ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-pink-400 focus:ring-pink-200"}`}
                            placeholder={t.enterDescription || "Enter description"}
                        />
                        {errors.roleDescription && <span className="text-xs text-red-500">{errors.roleDescription.message}</span>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[15px] font-semibold text-slate-700 ml-1">
                            {t.tags || "Tags"} <span className="text-red-500">*</span>
                        </label>
                        <div className={`w-full border rounded-lg px-2 py-1.5 min-h-[42px] flex flex-wrap gap-2 items-center bg-white transition-all focus-within:ring-2 ${errors.tags ? "border-red-500 focus-within:ring-red-100" : "border-slate-300 focus-within:ring-pink-200 focus-within:border-pink-400"}`}>
                            {tagsList.map((tag, index) => (
                                <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-md border border-pink-100">
                                    {tag}
                                    <button type="button" onClick={() => setTagsList(tagsList.filter(t => t !== tag))} className="hover:text-pink-800"><X size={14} /></button>
                                </span>
                            ))}
                            <input 
                                value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => { if(e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                                onBlur={() => { if(tagInput.trim()) addTag(tagInput); }}
                                placeholder={tagsList.length === 0 ? t.tagPlaceholder || "Type and press Enter to add tag" : ""}
                                className="flex-1 bg-transparent outline-none text-[15px] min-w-[120px] h-full py-1"
                            />
                        </div>
                        {errors.tags && <span className="text-xs text-red-500">{errors.tags.message}</span>}
                    </div>
                </div>
            </div>

            {/* Permissions Card */}
            <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                    <h3 className="text-lg font-bold text-slate-800">{t.permissions || "Permissions"}</h3>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={permissionSearch} 
                        onChange={(e) => setPermissionSearch(e.target.value)}
                        placeholder={t.searchPermissions || "Search permissions..."}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[15px] outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                    />
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {filteredGroups.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-[15px]">{t.noPermissionsFound || "No permissions found"}</div>
                    ) : (
                        filteredGroups.map((group) => {
                            const idsInGroup = group.apiPermissions.map(p => getPermissionId(group.controllerName, p.apiName));
                            const isAllSelected = idsInGroup.length > 0 && idsInGroup.every(id => selectedPermissionIds.has(id));
                            const isExpanded = expandedGroups.has(group.controllerName) || !!permissionSearch;
                            return (
                                <div key={group.controllerName} className="border-b border-slate-100 last:border-0">
                                    <div className="flex items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer select-none" onClick={() => toggleExpand(group.controllerName)}>
                                        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                                            <input type="checkbox" checked={isAllSelected} onChange={() => toggleGroup(group)} className="w-4 h-4 rounded border-slate-300 text-pink-500 accent-pink-500 focus:ring-pink-200 cursor-pointer mr-3" />
                                        </div>
                                        <span className="flex-1 font-bold text-slate-700 text-[15px]">{group.controllerName}</span>
                                        {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                                    </div>
                                    {isExpanded && (
                                        <div className="px-4 py-2 bg-white space-y-1 animate-in slide-in-from-top-1 duration-200">
                                            {group.apiPermissions.map(permission => {
                                                const permId = getPermissionId(group.controllerName, permission.apiName);
                                                return (
                                                    <div key={permId} className="flex items-center py-2 px-2 hover:bg-pink-50/30 rounded-lg transition-colors cursor-pointer" onClick={() => togglePermission(permId)}>
                                                        <input type="checkbox" checked={selectedPermissionIds.has(permId)} onChange={() => togglePermission(permId)} className="w-4 h-4 rounded border-slate-300 text-pink-500 accent-pink-500 focus:ring-pink-200 cursor-pointer mr-3" />
                                                        <span className="text-[14px] text-slate-600 font-medium">{permission.apiName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-xl shrink-0 z-10">
        <button type="button" onClick={handleCancel} className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all active:scale-95 uppercase tracking-wide">
            {t.cancel || "Cancel"}
        </button>
        <button type="button" onClick={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(); }} disabled={isLoading} className="flex items-center justify-center px-10 py-2.5 text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-md disabled:opacity-50 transition-all active:scale-95 uppercase tracking-wide">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (t.save || "Save")}
        </button>
      </div>

      {showLeaveModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] relative overflow-hidden animate-in zoom-in-95 duration-200 border-none">
               <button onClick={() => setShowLeaveModal(false)} className="absolute right-4 top-4 p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={18} />
               </button>
               <div className="p-6">
                  <div className="text-left pr-6">
                    <h3 className="text-xl font-bold text-slate-900 leading-none">
                        {t.leavePageTitle || "Leave Page"}
                    </h3>
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                        {t.leavePageDescription || "You have unsaved changes. Are you sure you want to leave without saving?"}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-8">
                    <button onClick={() => setShowLeaveModal(false)} className="h-10 px-6 rounded-lg font-bold bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-sm transition-all">
                        {t.cancel || "Cancel"}
                    </button>
                    <button onClick={() => router.back()} className="h-10 px-8 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white text-sm shadow-md active:scale-95">
                        {t.confirm || t.ok || "OK"}
                    </button>
                  </div>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};