import { supabase } from "./supabase";
import type { PublicInfo, PublicInfoCategory } from "@/types";

export const CATEGORY_META: Record<PublicInfoCategory, { label: string; icon: string; color: string }> = {
  itinerary:    { label: "Itinerario",    icon: "🗺️",  color: "bg-blue-50 border-blue-200 text-blue-700"    },
  contact:      { label: "Contactos",     icon: "📞",  color: "bg-green-50 border-green-200 text-green-700"  },
  rules:        { label: "Reglamento",    icon: "📋",  color: "bg-amber-50 border-amber-200 text-amber-700"  },
  faq:          { label: "Preguntas",     icon: "❓",  color: "bg-purple-50 border-purple-200 text-purple-700"},
  announcement: { label: "Anuncio",       icon: "📣",  color: "bg-red-50 border-red-200 text-red-700"        },
  other:        { label: "Otro",          icon: "📌",  color: "bg-slate-50 border-slate-200 text-slate-700"  },
};

export const publicInfoService = {

  async getAll(): Promise<PublicInfo[]> {
    const { data, error } = await supabase
      .from("public_info")
      .select("*, author:users(id, full_name)")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(
    payload: {
      title: string;
      content: string;
      category: PublicInfoCategory;
      is_pinned: boolean;
      created_by: string;
    }
  ): Promise<PublicInfo> {
    const { data, error } = await supabase
      .from("public_info")
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*, author:users(id, full_name)")
      .single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<Pick<PublicInfo, "title" | "content" | "category" | "is_pinned">>
  ): Promise<PublicInfo> {
    const { data, error } = await supabase
      .from("public_info")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*, author:users(id, full_name)")
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("public_info").delete().eq("id", id);
    if (error) throw error;
  },

  // Generate a shareable plain-text version of an item
  getShareText(item: PublicInfo): string {
    const cat = CATEGORY_META[item.category];
    return `${cat.icon} *${item.title}*\n\n${item.content}\n\n— Viaje de Egresados 2026`;
  },
};
