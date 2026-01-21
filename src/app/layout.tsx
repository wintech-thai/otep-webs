// src/app/layout.tsx

import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/provider/query-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Console Otep",
  description: "Internal Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={prompt.variable}>
      <body className={cn(
          "min-h-screen bg-slate-50 antialiased font-sans" 
      )}>
        <LanguageProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </LanguageProvider>

        
      </body>
    </html>
  );
}