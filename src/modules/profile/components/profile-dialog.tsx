"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 
import { toast } from "sonner"; 
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

import { useLanguage } from "@/providers/language-provider";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

import { profileApi } from "../api/profile.api";
import { profileSchema, ProfileSchemaType } from "../schema/profile.schema";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  } catch (e) { return null; }
};

export const ProfileDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const currentUsername = useMemo(() => {
    const token = Cookies.get("auth_token");
    if (!token) return "";
    return parseJwt(token)?.preferred_username || "";
  }, [open]);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: "", email: "", firstName: "", lastName: "", phoneNumber: "", secondaryEmail: "" },
  });

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
        username: u.userName,
        email: u.userEmail,
        firstName: u.name,       // ข้อมูลจริงจาก DB
        lastName: u.lastName,    // ข้อมูลจริงจาก DB
        phoneNumber: u.phoneNumber || "",
        secondaryEmail: u.secondaryEmail || "",
      });
    }
  }, [apiResponse, form]);

  const updateMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (response: any) => {
      const data = response.data || response;
      if (data && data.status !== "SUCCESS") {
         toast.error(data.description || t.msgProfileError);
         return; 
      }

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      toast.success(t.msgProfileSuccess);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.description || t.msgProfileError);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.updateProfileTitle}</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem><FormLabel>{t.username}</FormLabel><Input {...field} disabled className="bg-slate-100" /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{t.email}</FormLabel><Input {...field} disabled className="bg-slate-100" /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>{t.firstName} *</FormLabel><Input {...field} /></FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>{t.lastName} *</FormLabel><Input {...field} /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem><FormLabel>{t.phoneNumber} *</FormLabel><Input {...field} /></FormItem>
                )} />
                <FormField control={form.control} name="secondaryEmail" render={({ field }) => (
                  <FormItem><FormLabel>{t.secondaryEmail}</FormLabel><Input {...field} /></FormItem>
                )} />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.save}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};