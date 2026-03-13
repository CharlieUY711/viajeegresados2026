"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import {
  LayoutDashboard, CalendarDays, DollarSign, Briefcase,
  ImageIcon, FileText, Gamepad2, UserCircle, Globe, Info,
} from "lucide-react";

const NAV_KEYS = [
  { href: "/dashboard",    key: "dashboard",    icon: LayoutDashboard },
  { href: "/events",       key: "events",        icon: CalendarDays    },
  { href: "/finance",      key: "finance",       icon: DollarSign      },
  { href: "/commissions",  key: "commissions",   icon: Briefcase       },
  { href: "/gallery",      key: "gallery",       icon: ImageIcon       },
  { href: "/documents",    key: "documents",     icon: FileText        },
  { href: "/games",        key: "games",         icon: Gamepad2        },
  { href: "/social",       key: "social",        icon: Globe           },
  { href: "/public-info",  key: "publicInfo",    icon: Info            },
  { href: "/profile",      key: "profile",       icon: UserCircle      },
] as const;

// Bottom nav shows first 5 + profile
const BOTTOM_NAV = [
  { href: "/dashboard",   key: "dashboard",   icon: LayoutDashboard },
  { href: "/events",      key: "events",       icon: CalendarDays    },
  { href: "/gallery",     key: "gallery",      icon: ImageIcon       },
  { href: "/social",      key: "social",       icon: Globe           },
  { href: "/public-info", key: "publicInfo",   icon: Info            },
  { href: "/profile",     key: "profile",      icon: UserCircle      },
] as const;

function LifeSchoolLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="LifeSchool">
      <g>
        <path d="M36 62 Q34 48 30 38 Q27 30 24 22" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M24 22 Q14 18 10 8 Q20 6 28 14 Q30 18 24 22Z" fill="#C41E3A"/>
        <path d="M30 38 Q38 28 46 26 Q44 36 36 42 Q32 42 30 38Z" fill="#C41E3A"/>
        <path d="M24 22 Q22 12 28 6 Q32 12 30 20 Q28 24 24 22Z" fill="#C41E3A"/>
      </g>
      <rect x="20" y="52" width="6" height="18" fill="#1B3A6B"/>
      <rect x="20" y="67" width="20" height="3" fill="#1B3A6B"/>
      <text x="42" y="70" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="20" fill="white" letterSpacing="1">IFE</text>
      <text x="96" y="70" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="20" fill="#1B3A6B">SCHOOL</text>
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t }    = useLang();

  const getLabel = (key: string) => {
    if (key === "social")     return "Redes Sociales";
    if (key === "publicInfo") return "Inf. Pública";
    return t.nav[key as keyof typeof t.nav] ?? key;
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-sidebar-gradient flex-col z-30 border-r border-white/[0.06]">

        <div className="h-20 flex flex-col items-start justify-center px-5 border-b border-white/[0.06] gap-1">
          <LifeSchoolLogo className="w-36 h-auto" />
          <p className="text-white/50 text-[10px] leading-none pl-0.5 tracking-wide">
            Viaje de Egresados 2026
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_KEYS.map(({ href, key, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const label  = getLabel(key);
              return (
                <li key={href} className="relative">
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-r-full" />
                  )}
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-red-500/15 text-red-400 border border-red-500/20"
                        : "text-white/55 hover:text-white/90 hover:bg-white/[0.06]"
                    )}
                  >
                    <Icon size={17} className={cn("flex-shrink-0", active ? "text-red-400" : "text-white/40")} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-3">
            <p className="text-red-300/70 text-[11px] leading-none mb-1">{t.app.countdown}</p>
            <p className="text-red-300 font-bold text-2xl leading-none">42</p>
            <p className="text-red-300/60 text-[11px] mt-0.5">{t.app.daysLeft}</p>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-900 border-t border-white/[0.08]">
        <ul className="flex items-center justify-around px-1 py-1">
          {BOTTOM_NAV.map(({ href, key, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const label  = getLabel(key);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all duration-150",
                    active ? "text-red-400" : "text-white/40 hover:text-white/70"
                  )}
                >
                  <Icon size={20} className={cn(active && "drop-shadow-[0_0_6px_rgba(196,30,58,0.6)]")} />
                  <span className="text-[9px] font-medium leading-none truncate w-full text-center">
                    {label}
                  </span>
                  {active && <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
