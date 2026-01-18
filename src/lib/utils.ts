import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ฟังก์ชันสำหรับรวม ClassNames ของ Tailwind
 * แก้ปัญหา Class ชนกัน และทำให้เขียน Conditional Class ง่ายขึ้น
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}