"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { 
  Loader2,
  ArrowLeft,
  X,
  Copy,
  Check,
  ChevronRight, 
  ChevronLeft,
  AlertTriangle // ✅ เพิ่มไอคอนตกใจ
} from "lucide-react";
import { toast } from "sonner"; 

import { userSchema, UserSchemaType } from "../schema/user.schema";
import { userApi, IUserRole } from "../api/user.api";
import { customRoleApi, ICustomRole } from "../api/custom-role.api"; 
import { useLanguage } from "@/providers/language-provider";

interface UserFormProps {
  userId?: string | null;
}

export const UserForm = ({ userId }: UserFormProps) => {
  const { t } = useLanguage() as { t: any };
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [availableRoles, setAvailableRoles] = useState<IUserRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<IUserRole[]>([]);
  const [leftChecked, setLeftChecked] = useState<Set<string>>(new Set());
  const [rightChecked, setRightChecked] = useState<Set<string>>(new Set());
  const [customRoles, setCustomRoles] = useState<ICustomRole[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: "",
      tmpUserEmail: "",
      tags: "", 
      roles: [], 
      customRoleId: "" 
    },
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    const initData = async () => {
      setIsFetching(true);
      try {
        const orgId = localStorage.getItem("current_org") || "default";
        
        const rolesRes = await userApi.getAvailableRoles(orgId);
        const allRoles: IUserRole[] = (rolesRes as any).data || rolesRes || [];
        
        try {
            const customRolesRes = await customRoleApi.getCustomRoles(orgId);
            const rawData = (customRolesRes as any).data || customRolesRes || [];
            if (Array.isArray(rawData)) {
                const mappedRoles = rawData.map((item: any) => ({
                    customRoleId: item.customRoleId || item.id || item.Id || item.roleId || "",
                    roleName: item.roleName || item.name || item.Name || "Unknown Role",
                }));
                setCustomRoles(mappedRoles.filter(r => r.customRoleId));
            }
        } catch (err) { setCustomRoles([]); }

        if (userId) {
          const userRes = await userApi.getUserById(orgId, userId);
          const currentUser = (userRes as any).data || userRes;

          if (currentUser && !Array.isArray(currentUser)) {
            form.reset({
              userId: currentUser.userId,
              userName: currentUser.userName,
              tmpUserEmail: currentUser.userEmail || currentUser.tmpUserEmail || "",
              tags: currentUser.tags || "",
              roles: currentUser.roles || [],
              customRoleId: currentUser.customRoleId || "" 
            });

            if (currentUser.tags) {
              setTagsList(currentUser.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
            }

            const currentRolesList = currentUser.roles || [];
            const selected: IUserRole[] = [];
            const available: IUserRole[] = [];
            allRoles.forEach(role => {
              if (currentRolesList.includes(role.roleName) || currentRolesList.includes(role.roleId)) {
                selected.push(role);
              } else {
                available.push(role);
              }
            });
            setSelectedRoles(selected.sort((a, b) => a.roleName.localeCompare(b.roleName)));
            setAvailableRoles(available.sort((a, b) => a.roleName.localeCompare(b.roleName)));
          }
        } else {
          setAvailableRoles(allRoles.sort((a, b) => a.roleName.localeCompare(b.roleName)));
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsFetching(false);
      }
    };
    initData();
  }, [userId, form]);

  useEffect(() => {
    form.setValue("tags", tagsList.join(","), { shouldValidate: true, shouldDirty: true });
  }, [tagsList, form]);

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tagsList.includes(trimmed)) {
        setTagsList(prev => [...prev, trimmed]);
        setTagInput("");
    }
  };

  const handleManualSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let currentTags = [...tagsList];
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
        currentTags.push(tagInput.trim());
        setTagsList(currentTags);
        setTagInput("");
    }
    form.setValue("tags", currentTags.join(","));
    await form.handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowLeaveModal(true);
    } else {
      router.back();
    }
  };

  const onSubmit = async (data: UserSchemaType) => {
    setIsLoading(true);
    try {
      const orgId = localStorage.getItem("current_org") || "default";
      if (userId) {
        await userApi.updateUser(orgId, userId, data);
        toast.success("User updated successfully");
        router.back();
      } else {
        const res: any = await userApi.inviteUser(orgId, data);
        
        const url = res.registrationUrl || 
                    res.RegistrationUrl || 
                    res.data?.registrationUrl || 
                    res.data?.RegistrationUrl;

        if (url) {
          setInviteUrl(url);
        } else {
          toast.success("User invited successfully");
          router.back();
        }
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
            <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-full transition">
                <ArrowLeft size={22} className="text-slate-500" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {userId ? (t.editUser || "Edit User") : (t.addUser || "Create New User")}
            </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 no-scrollbar">
        <form id="user-form" className="space-y-6 w-full mx-auto">
          
          <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                {t.userInformation || "User Information"}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[15px] font-semibold text-slate-700 ml-1">{t.username || "Username"} <span className="text-red-500">*</span></label>
                <input 
                    {...form.register("userName")} disabled={!!userId} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 disabled:bg-slate-100 transition-all"
                    placeholder="Enter username"
                />
                {form.formState.errors.userName && <span className="text-xs text-red-500">{form.formState.errors.userName.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-[15px] font-semibold text-slate-700 ml-1">{t.email || "Email"} <span className="text-red-500">*</span></label>
                <input 
                    {...form.register("tmpUserEmail")} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                    placeholder="example@email.com"
                />
                {form.formState.errors.tmpUserEmail && <span className="text-xs text-red-500">{form.formState.errors.tmpUserEmail.message}</span>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-[15px] font-semibold text-slate-700 ml-1">{t.tags || "Tags"} <span className="text-red-500">*</span></label>
                <div className={`w-full border rounded-lg px-2 py-1.5 min-h-[42px] flex flex-wrap gap-2 items-center bg-white transition-all ${
                    form.formState.errors.tags ? "border-red-500 ring-1 ring-red-200" : "border-slate-300 focus-within:ring-2 focus-within:ring-pink-200 focus-within:border-pink-400"
                }`}>
                    {tagsList.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-md border border-pink-100">
                            {tag}
                            <button type="button" onClick={() => setTagsList(tagsList.filter(t => t !== tag))} className="hover:text-pink-800">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    <input 
                        value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                        onBlur={() => { if(tagInput.trim()) addTag(tagInput); }}
                        placeholder={tagsList.length === 0 ? "Press Enter to add tag" : ""}
                        className="flex-1 bg-transparent outline-none text-[15px] min-w-[120px] h-full py-1"
                    />
                </div>
                {form.formState.errors.tags && <span className="text-xs text-red-500">{form.formState.errors.tags.message}</span>}
              </div>

              <div className="space-y-2 md:col-span-2 pt-2">
                <label className="text-[15px] font-semibold text-slate-700 ml-1">{t.selectCustomRole || "Select Custom Role"}</label>
                <select 
                    {...form.register("customRoleId")}
                    className="w-full appearance-none border border-slate-300 rounded-lg px-3 py-2.5 text-[15px] focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none bg-white cursor-pointer"
                >
                    <option value="">{t.selectCustomRolePlaceholder || "Select custom role..."}</option>
                    {customRoles.map((role) => <option key={role.customRoleId} value={role.customRoleId}>{role.roleName}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">{t.systemRoles || "System Roles"}</h3>
            <div className="flex flex-col lg:flex-row gap-6 h-[400px]">
              <div className="flex-1 flex flex-col border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                  <input type="checkbox" checked={availableRoles.length > 0 && leftChecked.size === availableRoles.length} onChange={() => setLeftChecked(leftChecked.size === availableRoles.length ? new Set() : new Set(availableRoles.map(r => r.roleId)))} className="w-4 h-4 rounded border-slate-300 text-pink-400" />
                  <span className="text-[15px] font-bold text-slate-600">{t.availableRoles || "Available Roles"}</span>
                </div>
                <div className="flex-1 overflow-y-auto bg-white no-scrollbar">
                  {availableRoles.map(role => (
                    <div key={role.roleId} onClick={() => { const s = new Set(leftChecked); s.has(role.roleId) ? s.delete(role.roleId) : s.add(role.roleId); setLeftChecked(s); }} className="flex items-center gap-3 p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={leftChecked.has(role.roleId)} readOnly className="w-4 h-4 rounded border-slate-300 text-pink-400" />
                      <div className="font-medium text-slate-700 text-[15px]">{role.roleName}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex lg:flex-col justify-center gap-3 items-center">
                <button type="button" onClick={() => {
                    const rolesToMove = availableRoles.filter(role => leftChecked.has(role.roleId));
                    const newSelected = [...selectedRoles, ...rolesToMove].sort((a,b) => a.roleName.localeCompare(b.roleName));
                    setSelectedRoles(newSelected);
                    setAvailableRoles(availableRoles.filter(role => !leftChecked.has(role.roleId)));
                    setLeftChecked(new Set());
                    form.setValue("roles", newSelected.map(r => r.roleName));
                }} disabled={leftChecked.size === 0} className="p-3 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200 disabled:opacity-50 transition-all"><ChevronRight size={20} /></button>
                <button type="button" onClick={() => {
                    const rolesToMove = selectedRoles.filter(role => rightChecked.has(role.roleId));
                    const newAvailable = [...availableRoles, ...rolesToMove].sort((a,b) => a.roleName.localeCompare(b.roleName));
                    setAvailableRoles(newAvailable);
                    setSelectedRoles(selectedRoles.filter(role => !rightChecked.has(role.roleId)));
                    setRightChecked(new Set());
                    form.setValue("roles", selectedRoles.filter(role => !rightChecked.has(role.roleId)).map(r => r.roleName));
                }} disabled={rightChecked.size === 0} className="p-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-all"><ChevronLeft size={20} /></button>
              </div>

              <div className="flex-1 flex flex-col border border-pink-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-pink-50 px-4 py-3 border-b border-pink-100 flex items-center gap-3">
                   <input type="checkbox" checked={selectedRoles.length > 0 && rightChecked.size === selectedRoles.length} onChange={() => setRightChecked(rightChecked.size === selectedRoles.length ? new Set() : new Set(selectedRoles.map(r => r.roleId)))} className="w-4 h-4 rounded border-pink-300 text-pink-400" />
                  <span className="text-[15px] font-bold text-pink-700">{t.selectedRoles || "Selected Roles"}</span>
                </div>
                <div className="flex-1 overflow-y-auto bg-white no-scrollbar">
                  {selectedRoles.map(role => (
                    <div key={role.roleId} onClick={() => { const s = new Set(rightChecked); s.has(role.roleId) ? s.delete(role.roleId) : s.add(role.roleId); setRightChecked(s); }} className="flex items-center gap-3 p-3 border-b border-slate-50 hover:bg-pink-50 cursor-pointer">
                      <input type="checkbox" checked={rightChecked.has(role.roleId)} readOnly className="w-4 h-4 rounded border-pink-300 text-pink-400" />
                      <div className="font-medium text-slate-700 text-[15px]">{role.roleName}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-xl shrink-0 z-10">
        <button 
          type="button" 
          onClick={handleCancel} 
          className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all active:scale-95 uppercase tracking-wide"
        >
          {t.cancel || "Cancel"}
        </button>
        <button 
          type="button" 
          onClick={handleManualSubmit}
          disabled={isLoading} 
          className="flex items-center justify-center px-10 py-2.5 text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-md disabled:opacity-50 transition-all active:scale-95 uppercase tracking-wide"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : (t.save || "Save")}
        </button>
      </div>

      {inviteUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Check className="text-green-500" size={20} />
                        User Invited Successfully
                    </h3>
                    <button onClick={() => { setInviteUrl(null); router.back(); }} className="p-1 rounded-full hover:bg-slate-100 text-slate-400"><X size={20} /></button>
                </div>
                <div className="px-6 py-6 space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Please copy the registration link below and send it to the user manually.
                    </p>
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <input 
                            readOnly value={inviteUrl}
                            className="flex-1 bg-transparent px-3 py-2 text-sm text-blue-600 font-bold outline-none"
                        />
                        <button 
                            onClick={() => { navigator.clipboard.writeText(inviteUrl); setIsCopied(true); toast.success("URL copied to clipboard"); setTimeout(() => setIsCopied(false), 2000); }}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ${
                              isCopied ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        >
                            {isCopied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                            {isCopied ? "COPIED" : "COPY LINK"}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button onClick={() => { setInviteUrl(null); router.back(); }} className="px-12 py-2 text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-sm transition-all active:scale-95 uppercase">
                        Done
                    </button>
                </div>
            </div>
        </div>
      )}

      {showLeaveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
               <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="text-amber-500 w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-800">Leave Page</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    You have unsaved changes. Are you sure you want to leave without saving?
                  </p>
               </div>
               
               <div className="flex gap-3 pt-2">
                 <button 
                    onClick={() => setShowLeaveModal(false)} 
                    className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={() => router.back()} 
                    className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-all active:scale-95"
                 >
                    OK
                 </button>
               </div>
            </div>
        </div>
      )}

    </div>
  );
};