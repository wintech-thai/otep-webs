import { LoginView } from "@/modules/auth/view/login.view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | OTEP Web",
};

export default function LoginPage() {
  return <LoginView />;
}