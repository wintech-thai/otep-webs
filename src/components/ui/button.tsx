import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. กำหนด Variants (รูปแบบต่างๆ ของปุ่ม)
const buttonVariants = cva(
  // Base Styles (สไตล์พื้นฐานที่มีทุกปุ่ม)
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // 🔥 Default: สไตล์สีชมพูของคุณ (ย้ายมาไว้ตรงนี้)
        default: 
          "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md shadow-pink-200 hover:opacity-95 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5",
        
        // ⚪ Outline: สำหรับปุ่ม Cancel (แก้ Error ที่เจอ)
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        
        // 👻 Ghost: สำหรับปุ่มใสๆ
        ghost: 
          "hover:bg-slate-100 hover:text-slate-900",
        
        // 🔴 Destructive: สำหรับปุ่มลบ/อันตราย
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      },
      size: {
        default: "h-11 px-8", // ขนาดเดิมของคุณ
        sm: "h-9 rounded-full px-3",
        lg: "h-12 rounded-full px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 2. เพิ่ม VariantProps เข้าไปใน Interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isPending?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, isPending, ...props }, ref) => {
    return (
      <button
        // 3. ใช้ buttonVariants ในการเลือก Class
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || isPending}
        {...props}
      >
        {isPending ? (
          // Spinner แบบง่ายๆ ตอน Loading
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }