import { supabase } from "./supabase";
import type { SocialHandle, SocialPlatform } from "@/types";

export const PLATFORM_META: Record<SocialPlatform, { label: string; baseUrl: string; color: string; bg: string }> = {
  instagram: { label: "Instagram", baseUrl: "https://instagram.com/", color: "text-pink-600",   bg: "bg-pink-50 border-pink-200"   },
  tiktok:    { label: "TikTok",    baseUrl: "https://tiktok.com/@",  color: "text-slate-900",  bg: "bg-slate-50 border-slate-200"  },
  facebook:  { label: "Facebook",  baseUrl: "https://facebook.com/", color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"   },
  youtube:   { label: "YouTube",   baseUrl: "https://youtube.com/@", color: "text-red-600",    bg: "bg-red-50 border-red-200"     },
};

export function buildProfileUrl(platform: SocialPlatform, handle: string): string {
  const base = PLATFORM_META[platform].baseUrl;
  const clean = handle.replace(/^@/, "");
  return `${base}${clean}`;
}

export const socialService = {

  async getAll(): Promise<SocialHandle[]> {
    const { data, error } = await supabase
      .from("social_handles")
      .select("*, user:users(id, full_name, avatar_url)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getByUser(userId: string): Promise<SocialHandle[]> {
    const { data, error } = await supabase
      .from("social_handles")
      .select("*")
      .eq("user_id", userId)
      .order("platform");
    if (error) throw error;
    return data ?? [];
  },

  async upsert(
    userId: string,
    platform: SocialPlatform,
    handle: string,
    isGroup = false
  ): Promise<SocialHandle> {
    const clean  = handle.trim().replace(/^@/, "");
    const url    = buildProfileUrl(platform, clean);

    const { data, error } = await supabase
      .from("social_handles")
      .upsert(
        {
          user_id:      userId,
          platform,
          handle:       clean,
          profile_url:  url,
          is_group:     isGroup,
          created_at:   new Date().toISOString(),
        },
        { onConflict: "user_id,platform" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(userId: string, platform: SocialPlatform): Promise<void> {
    const { error } = await supabase
      .from("social_handles")
      .delete()
      .eq("user_id", userId)
      .eq("platform", platform);
    if (error) throw error;
  },
};
