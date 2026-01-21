"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useLanguage } from "@/providers/language-provider"; 

import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"; 

import { profileApi } from "../api/profile.api";
// ✅ ใช้ Schema ภาษาอังกฤษที่เราสร้างไว้ (เปลี่ยนชื่อ field ให้ตรงกับ Schema)
import { changePasswordSchema, ChangePasswordSchemaType } from "../schema/change-password.schema";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({ open, onOpenChange }: ChangePasswordDialogProps) => {
  const { t } = useLanguage();

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    // ✅ ใช้ชื่อ field ตาม schema (oldPassword, newPassword, confirmPassword)
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (response: any) => {
      const data = response.data || response;
      
      // ✅ ดักจับ Error: ถ้าไม่ใช่ SUCCESS ให้ถือว่าเป็น Error
      if (data && data.status !== "SUCCESS") {
        toast.error(data.description || data.message || t.msgPasswordError);
        return;
      }

      toast.success(t.msgPasswordSuccess);
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Change Password Error:", error);
      const msg = error?.response?.data?.message || error?.response?.data?.description || t.msgPasswordError;
      toast.error(msg);
    },
  });

  const onSubmit = (data: ChangePasswordSchemaType) => {
    // ✅ ส่ง data ไปตามโครงสร้างที่ Schema กำหนด (oldPassword, newPassword)
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.changePasswordTitle}</DialogTitle>
          <DialogDescription>
            {t.descChangePassword} 
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="oldPassword" // ✅ เปลี่ยนให้ตรงกับ Schema
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.currentPassword}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t.currentPassword} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.newPassword}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t.newPassword} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.confirmPassword}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t.confirmPassword} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.save}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};