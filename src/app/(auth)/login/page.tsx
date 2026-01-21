import { LoginView } from "@/modules/auth/view/login.view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console Otep",
};

export default function LoginPage() {
  return <LoginView />;
}