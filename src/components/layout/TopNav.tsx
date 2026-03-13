"use client";
import { usePathname } from "next/navigation";
import { Bell, Search, Settings } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/i18n";

export function TopNav() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-cream-200 flex items-center px-6 gap-4 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <p className="text-base font-black text-navy-900 leading-none tracking-tight">Grupos</p>
        <p className="text-[10px] text-navy-400 leading-none mt-0.5">by Charlie</p>
        <p className="text-[9px] text-navy-300 leading-none mt-0.5">© 2026</p>
      </div>
      <div className="hidden md:flex items-center gap-2 bg-cream-100 border border-cream-200 rounded-xl px-3 py-2 w-56">
        <Search size={14} className="text-navy-300 flex-shrink-0" />
        <input
          type="text"
          placeholder={t.topnav.search}
          className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none flex-1 min-w-0"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-navy-400 hover:bg-cream-100 hover:text-navy-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-navy-400 hover:bg-cream-100 hover:text-navy-700 transition-colors">
          <Settings size={18} />
        </button>
        <div className="w-px h-6 bg-cream-200 mx-1" />
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <Avatar name={user?.full_name ?? "Usuario"} src={user?.avatar_url} size="sm" />
          <div className="hidden sm:block min-w-0">
            <p className="text-xs font-semibold text-navy-800 leading-none truncate max-w-[120px]">
              {user?.full_name ?? "Invitado"}
            </p>
            <p className="text-[10px] text-navy-400 mt-0.5 leading-none capitalize">
              {user?.role ? t.topnav.role[user.role] : t.topnav.role.member}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}