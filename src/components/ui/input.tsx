import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[14px] font-medium text-slate-700 ml-0.5 block">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm transition-all outline-none",
            "text-slate-900 antialiased font-normal",
            "placeholder:text-slate-400 placeholder:font-normal",
            "focus:border-primary focus:ring-4 focus:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            errorMessage && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <p className="text-[12px] font-medium text-red-500 ml-0.5 mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }