import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full space-y-3"> 
        {label && (
          <label className="text-[15px] font-semibold text-slate-700 ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl bg-slate-100 px-4 py-2 text-base text-slate-900 transition-all outline-none border-2 border-transparent",
            "placeholder:text-slate-400 font-normal",
            "focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10",
            errorMessage && "bg-red-50 border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <span className="text-sm text-red-500 ml-1 font-medium">{errorMessage}</span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }