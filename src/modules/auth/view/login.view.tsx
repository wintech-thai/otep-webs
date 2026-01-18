"use client";

import { useEffect } from "react"; 
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Cookies from "js-cookie"; 

import { loginSchema, LoginSchemaType } from "../schema/login.schema";
import { authApi } from "../api/auth.api";
import { AuthLayout } from "../components/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios"; 

export const LoginView = () => {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("current_org");
    
    delete apiClient.defaults.headers.common['Authorization'];
    
    console.log("Session cleaned up!"); 
  }, []);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "all",
  });

  const { errors } = form.formState;

  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchemaType) => {
        const loginResponse = await authApi.login(data);
        const accessToken = loginResponse?.token?.access_token;

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Request timed out")), 2000)
        );

        try {
            const orgs = await Promise.race([
                authApi.getAllowedOrg(accessToken),
                timeoutPromise
            ]);
            
            const targetOrg = (Array.isArray(orgs) && orgs.length > 0) ? orgs[0] : "default";
            localStorage.setItem("current_org", targetOrg);
            
        } catch (e) {
            console.warn("Using default org due to error/timeout:", e);
            localStorage.setItem("current_org", "default");
        }

        return true;
    },
    onSuccess: () => {
      toast.success("Login successful");
      
      // Delay Redirect 1 วินาที
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 1000);
    },
    onError: (error) => {
      console.error("Login error", error);
      toast.error("Invalid username or password");
    },
  });

  const handleLogin = (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout header="Sign In to your account">
      <Toaster position="top-center" richColors /> 
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <Controller
          control={form.control}
          name="username"
          render={({ field }) => (
            <Input
              {...field}
              maxLength={20} 
              label="Username"
              placeholder="Username"
              errorMessage={errors.username?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              maxLength={20} 
              label="Password"
              placeholder="Password"
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Button 
            type="submit" 
            isPending={loginMutation.isPending} 
            className="w-full mt-4" 
        >
          Sign In
        </Button>

        <button
          type="button"
          className="underline text-otep-primary text-left cursor-pointer text-sm mt-2 text-pink-500"
          onClick={() => toast.info("Forgot Password feature coming soon")}
        >
          Forgot Password
        </button>
      </form>
    </AuthLayout>
  );
};