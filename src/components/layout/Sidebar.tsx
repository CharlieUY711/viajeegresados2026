"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import {
  LayoutDashboard, CalendarDays, DollarSign, Users,
  ImageIcon, FileText, Gamepad2, UserCircle, Globe, Info,
} from "lucide-react";

const NAV_KEYS = [
  { href: "/dashboard",    label: "Dashboard",       icon: LayoutDashboard },
  { href: "/events",       label: "Eventos",          icon: CalendarDays    },
  { href: "/finance",      label: "Finanzas",         icon: DollarSign      },
  { href: "/commissions",  label: "Grupos",           icon: Users           },
  { href: "/gallery",      label: "Galeria",          icon: ImageIcon       },
  { href: "/documents",    label: "Documentos",       icon: FileText        },
  { href: "/games",        label: "Juegos",           icon: Gamepad2        },
  { href: "/social",       label: "Redes Sociales",   icon: Globe           },
  { href: "/public-info",  label: "Info Publica",     icon: Info            },
  { href: "/profile",      label: "Perfil",           icon: UserCircle      },
] as const;

const BOTTOM_NAV = [
  { href: "/dashboard",   label: "Dashboard",  icon: LayoutDashboard },
  { href: "/events",      label: "Eventos",     icon: CalendarDays    },
  { href: "/gallery",     label: "Galeria",     icon: ImageIcon       },
  { href: "/commissions", label: "Grupos",      icon: Users           },
  { href: "/profile",     label: "Perfil",      icon: UserCircle      },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col z-30 border-r border-orange-600/30" style={{ backgroundColor: "#F97316" }}>

        <div className="h-20 flex flex-col items-start justify-center px-5 border-b border-black/10 gap-0.5">
          <p className="text-black font-black text-xl tracking-tight leading-none">Charlie</p>
          <p className="text-black/60 text-[11px] leading-none tracking-wide">Viaje de Egresados 2026</p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_KEYS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                      active
                        ? "bg-black/15 text-black"
                        : "text-white hover:bg-black/10 hover:text-black"
                    )}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-black/10">
          <div className="bg-black/10 border border-black/15 rounded-xl px-3 py-3">
            <p className="text-black/60 text-[11px] leading-none mb-1">Cuenta regresiva</p>
            <p className="text-black font-bold text-2xl leading-none">42</p>
            <p className="text-black/50 text-[11px] mt-0.5">dias restantes</p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-black/10" style={{ backgroundColor: "#F97316" }}>
        <ul className="flex items-center justify-around px-1 py-1">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all duration-150",
                    active ? "text-black" : "text-white hover:text-black"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[9px] font-semibold leading-none truncate w-full text-center">
                    {label}
                  </span>
                  {active && <span className="w-1 h-1 rounded-full bg-black mt-0.5" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}