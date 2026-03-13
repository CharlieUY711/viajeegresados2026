import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary:
    "bg-amber-500 hover:bg-amber-400 text-navy-950 font-semibold shadow-sm hover:shadow-glow active:scale-[0.98]",
  secondary:
    "bg-navy-800 hover:bg-navy-700 text-white font-medium shadow-sm active:scale-[0.98]",
  ghost:
    "bg-transparent hover:bg-navy-50 text-navy-700 hover:text-navy-900 font-medium",
  danger:
    "bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm active:scale-[0.98]",
  outline:
    "bg-transparent border border-navy-200 hover:border-amber-400 hover:bg-amber-50 text-navy-700 font-medium",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={14} />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
