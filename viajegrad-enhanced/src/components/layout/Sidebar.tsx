"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import {
  LayoutDashboard, CalendarDays, DollarSign, Briefcase,
  ImageIcon, FileText, Gamepad2, UserCircle, GraduationCap,
} from "lucide-react";

const NAV_KEYS = [
  { href: "/dashboard",   key: "dashboard",   icon: LayoutDashboard },
  { href: "/events",      key: "events",       icon: CalendarDays    },
  { href: "/finance",     key: "finance",      icon: DollarSign      },
  { href: "/commissions", key: "commissions",  icon: Briefcase       },
  { href: "/gallery",     key: "gallery",      icon: ImageIcon       },
  { href: "/documents",   key: "documents",    icon: FileText        },
  { href: "/games",       key: "games",        icon: Gamepad2        },
  { href: "/profile",     key: "profile",      icon: UserCircle      },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t }    = useLang();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-sidebar-gradient flex flex-col z-30 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-glow flex-shrink-0">
          <GraduationCap size={16} className="text-navy-950" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-white text-sm leading-none tracking-wide">{t.app.name}</p>
          <p className="text-white/40 text-[10px] mt-0.5 leading-none">{t.app.tagline}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV_KEYS.map(({ href, key, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const label  = t.nav[key as keyof typeof t.nav];
            return (
              <li key={href} className="relative">
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-r-full" />
                )}
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      : "text-white/55 hover:text-white/90 hover:bg-white/[0.06]"
                  )}
                >
                  <Icon
                    size={17}
                    className={cn("flex-shrink-0 transition-colors", active ? "text-amber-400" : "text-white/40")}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Countdown widget */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-3">
          <p className="text-amber-300/70 text-[11px] leading-none mb-1">{t.app.countdown}</p>
          <p className="text-amber-300 font-bold text-2xl leading-none">42</p>
          <p className="text-amber-300/60 text-[11px] mt-0.5">{t.app.daysLeft}</p>
        </div>
      </div>
    </aside>
  );
}
