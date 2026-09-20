import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:from-brand-700 hover:to-brand-600",
      secondary:
        "bg-gradient-to-r from-accent-500 to-accent-400 text-white shadow-md shadow-accent-500/20 hover:shadow-lg hover:from-accent-600 hover:to-accent-500",
      outline:
        "border-2 border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger:
        "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-600/20 hover:from-red-700 hover:to-red-600",
    };
    const sizes = {
      sm: "px-3.5 py-2 text-xs font-semibold rounded-xl",
      md: "px-5 py-2.5 text-sm font-semibold rounded-xl",
      lg: "px-6 py-3.5 text-base font-semibold rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
