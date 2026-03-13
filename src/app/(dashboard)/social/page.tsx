"use client";

import { useState, useEffect, useCallback } from "react";
import { ExternalLink, Users, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { socialService, PLATFORM_META } from "@/services/socialService";
import { supabase } from "@/services/supabase";
import type { SocialHandle, SocialPlatform, User } from "@/types";

const PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "youtube"];

// â”€â”€â”€ Platform icon SVGs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PlatformIcon({ platform, size = 18 }: { platform: SocialPlatform; size?: number }) {
  const icons: Record<SocialPlatform, JSX.Element> = {
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  };
  return icons[platform];
}

// â”€â”€â”€ User card with their social handles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function UserSocialCard({ user, handles }: { user: User; handles: SocialHandle[] }) {
  if (handles.length === 0) return null;
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar name={user.full_name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-navy-900">{user.full_name}</p>
          <p className="text-xs text-navy-400">{handles.length} red{handles.length !== 1 ? "es" : ""}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {handles.map(h => {
          const meta = PLATFORM_META[h.platform];
          return (
            <a
              key={h.id}
              href={h.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:scale-105",
                meta.bg, meta.color
              )}
            >
              <PlatformIcon platform={h.platform} size={13} />
              @{h.handle}
              <ExternalLink size={10} className="opacity-60" />
            </a>
          );
        })}
      </div>
    </Card>
  );
}

// â”€â”€â”€ Group accounts section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function GroupAccounts({ handles }: { handles: SocialHandle[] }) {
  if (handles.length === 0) return null;
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Globe size={15} className="text-navy-400" />
        <p className="text-sm font-semibold text-navy-900">Cuentas del viaje</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {handles.map(h => {
          const meta = PLATFORM_META[h.platform];
          return (
            <a
              key={h.id}
              href={h.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:scale-105",
                meta.bg, meta.color
              )}
            >
              <PlatformIcon platform={h.platform} size={16} />
              {meta.label}
              <span className="opacity-70 text-xs">@{h.handle}</span>
              <ExternalLink size={11} className="opacity-60" />
            </a>
          );
        })}
      </div>
    </Card>
  );
}

// â”€â”€â”€ Filter bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FilterBar({ active, onChange }: { active: SocialPlatform | "all"; onChange: (v: SocialPlatform | "all") => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
          active === "all"
            ? "bg-navy-900 text-white border-navy-900"
            : "bg-white text-navy-500 border-cream-200 hover:border-navy-300"
        )}
      >
        Todas
      </button>
      {PLATFORMS.map(p => {
        const meta = PLATFORM_META[p];
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              active === p
                ? "bg-navy-900 text-white border-navy-900"
                : cn("bg-white border-cream-200 hover:border-navy-300", meta.color)
            )}
          >
            <PlatformIcon platform={p} size={12} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

// â”€â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function SocialPage() {
  const [handles, setHandles]   = useState<(SocialHandle & { user?: User })[]>([]);
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<SocialPlatform | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [handlesData, usersRes] = await Promise.all([
        socialService.getAll(),
        supabase.from("users").select("id, full_name, avatar_url, role").order("full_name"),
      ]);
      setHandles(handlesData);
      setUsers((usersRes.data ?? []) as any[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const groupHandles = handles.filter(h => h.is_group);
  const userHandles  = handles.filter(h => !h.is_group);

  const filteredUserHandles = filter === "all"
    ? userHandles
    : userHandles.filter(h => h.platform === filter);

  // Group by user
  const byUser = users.reduce<Record<string, SocialHandle[]>>((acc, u) => {
    acc[u.id] = filteredUserHandles.filter(h => h.user_id === u.id);
    return acc;
  }, {});

  const usersWithHandles = users.filter(u => byUser[u.id]?.length > 0);

  return (
    <div className="space-y-5 page-enter">

      {/* Group accounts */}
      <GroupAccounts handles={groupHandles} />

      {/* Filter + count */}
      <div className="space-y-3">
        <FilterBar active={filter} onChange={setFilter} />
        <div className="flex items-center gap-2 text-xs text-navy-400">
          <Users size={13} />
          <span>{usersWithHandles.length} usuarios con redes sociales</span>
        </div>
      </div>

      {/* User cards */}
      {loading ? (
        <div className="text-center py-16 text-navy-400">Cargando...</div>
      ) : usersWithHandles.length === 0 ? (
        <div className="text-center py-16 text-navy-400">
          <p className="text-sm">NingÃºn usuario ha agregado redes sociales todavÃ­a.</p>
          <p className="text-xs mt-1">PodÃ©s agregar las tuyas desde tu perfil.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {usersWithHandles.map(u => (
            <UserSocialCard key={u.id} user={u as User} handles={byUser[u.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
