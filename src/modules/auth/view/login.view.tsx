"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner"; 

import { loginSchema, LoginSchemaType } from "../schema/login.schema";
import { authApi } from "../api/auth.api";
import { AuthLayout } from "../components/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LoginView = () => {
  const router = useRouter();

  // 1. Setup Form 
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "all",
  });

  const { errors } = form.formState;

  // 2. Setup API Mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginSchemaType) => authApi.login(data),
    onSuccess: (res) => {
      toast.success("Login successful");
      router.push("/dashboard"); 
    },
    onError: (error) => {
      console.error("Login error", error);
      toast.error("Invalid credentials");
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
          className="underline text-otep-primary text-left cursor-pointer text-sm mt-2"
          onClick={() => toast.info("Forgot Password feature coming soon")}
        >
          Forgot Password?
        </button>
      </form>
    </AuthLayout>
  );
};