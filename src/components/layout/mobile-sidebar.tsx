"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; 
import { Sidebar } from "@/components/layout/sidebar"; 
import { useState, useEffect } from "react";

export const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 bg-white w-[260px] border-r-0">
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle> {/* ซ่อน Title ไว้สำหรับ Screen Reader */}
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};