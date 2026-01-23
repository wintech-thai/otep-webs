"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 
import { toast } from "sonner"; 
import { Loader2, X } from "lucide-react"; // ✅ เพิ่ม X เข้ามา
import Cookies from "js-cookie";

import { useLanguage } from "@/providers/language-provider";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel,
} from "@/components/ui/form";

import { profileApi } from "../api/profile.api";
import { profileSchema, ProfileSchemaType } from "../schema/profile.schema";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  } catch (e) { return null; }
};

export const ProfileDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { t } = useLanguage() as { t: any };
  const queryClient = useQueryClient();

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentUsername = useMemo(() => {
    const token = Cookies.get("auth_token");
    if (!token) return "";
    return parseJwt(token)?.preferred_username || "";
  }, [open]);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: "", email: "", firstName: "", lastName: "", phoneNumber: "", secondaryEmail: "" },
  });

  const { isDirty } = form.formState;

  const { data: apiResponse, isLoading: isFetching } = useQuery({
    queryKey: ["user-profile", currentUsername],
    queryFn: () => profileApi.getUserByUserName(currentUsername),
    enabled: open && !!currentUsername, 
    staleTime: 0, 
  });

  useEffect(() => {
    if (apiResponse?.data?.user) {
      const u = apiResponse.data.user;
      form.reset({
        username: u.userName || "",
        email: u.userEmail || "",
        firstName: u.name || "",
        lastName: u.lastName || "",
        phoneNumber: u.phoneNumber || "",
        secondaryEmail: u.secondaryEmail || "",
      });
    }
  }, [apiResponse, form, open]);

  const updateMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (response: any) => {
      const data = response.data || response;
      if (data && data.status !== "SUCCESS") {
         toast.error(data.description || t.msgProfileError);
         return; 
      }
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(t.msgProfileSuccess || "Profile updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.description || t.msgProfileError);
    },
  });

  const handleOnSubmit = (data: ProfileSchemaType) => {
    if (!isDirty) {
      onOpenChange(false);
      return;
    }
    updateMutation.mutate(data);
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowExitConfirm(true); 
    } else {
      onOpenChange(false); 
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => { if (!val) handleAttemptClose(); }}>
        <DialogContent 
           className="sm:max-w-[600px] overflow-hidden"
           onPointerDownOutside={(e) => { if (isDirty) e.preventDefault(); }}
           onEscapeKeyDown={(e) => { if (isDirty) e.preventDefault(); }}
        >
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-slate-800">{t.updateProfileTitle || "Update Profile"}</DialogTitle>
          </DialogHeader>

          {isFetching ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5 pt-4">
                {/* ... (ส่วนของ FormField อื่นๆ เหมือนเดิม) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-slate-700">{t.username}</FormLabel><Input {...field} disabled className="bg-slate-50 border-slate-200" /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-slate-700">{t.email}</FormLabel><Input {...field} disabled className="bg-slate-50 border-slate-200" /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-slate-700">{t.firstName} *</FormLabel><Input {...field} /></FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-slate-700">{t.lastName} *</FormLabel><Input {...field} /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-slate-700">{t.phoneNumber} *</FormLabel><Input {...field} /></FormItem>
                  )} />
                  <FormField control={form.control} name="secondaryEmail" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-slate-700">{t.secondaryEmail}</FormLabel><Input {...field} /></FormItem>
                  )} />
                </div>

                <DialogFooter className="pt-6 border-t gap-2">
                  <Button type="button" variant="ghost" onClick={handleAttemptClose} className="px-6 font-bold text-slate-500">
                    {t.cancel || "Cancel"}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="px-10 font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-all"
                  >
                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.save || "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ ปรับปรุง AlertDialog ให้จัดวางตามรูปตัวอย่าง */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="max-w-[400px] rounded-xl p-0 overflow-hidden border-none shadow-2xl"> 
          {/* ✅ ปุ่มปิดมุมขวาบน */}
          <AlertDialogCancel className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none border-none p-0 h-auto bg-transparent">
            <X className="h-4 w-4 text-slate-500" />
          </AlertDialogCancel>

          <div className="p-6">
            <AlertDialogHeader className="text-left"> {/* ✅ จัดชิดซ้าย */}
              <AlertDialogTitle className="text-xl font-bold text-slate-900">
                Leave Page
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 text-sm mt-2">
                You have unsaved changes. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="flex flex-row justify-end gap-2 pt-8"> {/* ✅ จัดชิดขวา */}
              <AlertDialogCancel 
                className="h-10 px-6 rounded-lg font-bold bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-sm mt-0 transition-all"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  setShowExitConfirm(false);
                  onOpenChange(false);
                }}
                className="h-10 px-6 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white text-sm transition-all"
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};