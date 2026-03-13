import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-navy-100 text-navy-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger:  "bg-red-100 text-red-700",
  info:    "bg-blue-100 text-blue-700",
  purple:  "bg-purple-100 text-purple-700",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const avatarSizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "bg-amber-400 text-amber-900",
    "bg-blue-400 text-blue-900",
    "bg-emerald-400 text-emerald-900",
    "bg-purple-400 text-purple-900",
    "bg-rose-400 text-rose-900",
  ];
  const colorIdx = name.charCodeAt(0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", avatarSizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        avatarSizes[size],
        colors[colorIdx],
        className
      )}
    >
      {initials}
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-300 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-navy-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-navy-400 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-navy-50 via-cream-200 to-navy-50 bg-[length:200%_100%] animate-shimmer rounded-lg",
        className
      )}
    />
  );
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
export function StatCard({
  icon,
  label,
  value,
  sub,
  trend,
  trendUp,
  color = "amber",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  color?: "amber" | "emerald" | "blue" | "rose";
}) {
  const iconBg: Record<string, string> = {
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-5 flex gap-4 items-start">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg[color])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-navy-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-navy-900 mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-xs text-navy-400 mt-1">{sub}</p>}
        {trend && (
          <p className={cn("text-xs font-medium mt-1", trendUp ? "text-emerald-600" : "text-rose-500")}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl animate-scale-in",
          modalSizes[size]
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <h2 className="text-base font-semibold text-navy-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
