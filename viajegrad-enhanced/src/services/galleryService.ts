import { supabase, uploadFile, deleteFile, BUCKETS } from "./supabase";
import type { GalleryItem } from "@/types";

export const galleryService = {
  async getAll(eventId?: string): Promise<GalleryItem[]> {
    let query = supabase
      .from("gallery_items")
      .select("*, event:events(id, title), uploader:users(id, full_name)")
      .order("uploaded_at", { ascending: false });

    if (eventId) query = query.eq("event_id", eventId);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async upload(
    file: File,
    userId: string,
    eventId?: string
  ): Promise<GalleryItem> {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const uploaded = await uploadFile(BUCKETS.GALLERY, path, file);
    if (!uploaded) throw new Error("Upload failed");

    const isVideo = file.type.startsWith("video/");

    const { data, error } = await supabase
      .from("gallery_items")
      .insert({
        storage_path: uploaded.storagePath,
        public_url: uploaded.publicUrl,
        type: isVideo ? "video" : "image",
        event_id: eventId ?? null,
        uploaded_by: userId,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(item: GalleryItem): Promise<void> {
    await deleteFile(BUCKETS.GALLERY, item.storage_path);
    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", item.id);
    if (error) throw error;
  },
};
