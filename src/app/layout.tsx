import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/provider/query-provider";
import { LanguageProvider } from "@/providers/language-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}