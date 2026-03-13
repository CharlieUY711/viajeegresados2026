import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Storage helpers ──────────────────────────────────────────────────────────
export const BUCKETS = {
  GALLERY: "gallery",
  DOCUMENTS: "documents",
  AVATARS: "avatars",
} as const;

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ publicUrl: string; storagePath: string } | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error || !data) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { publicUrl: urlData.publicUrl, storagePath: data.path };
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error("Delete error:", error);
    return false;
  }
  return true;
}
