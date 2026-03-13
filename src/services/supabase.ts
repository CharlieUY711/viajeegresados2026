import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vjyjyeivdacwiwmbzhdx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_aHxvyCpy6VhHi4ppWc_OLA_mbrV8mQQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  console.log("uploadFile START:", { bucket, path });

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("uploadFile ERROR:", error.message, error);
    alert("Storage error: " + error.message);
    return null;
  }

  if (!data) {
    console.error("uploadFile: no data returned");
    return null;
  }

  console.log("uploadFile SUCCESS:", data.path);

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { publicUrl: urlData.publicUrl, storagePath: data.path };
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) { console.error("deleteFile error:", error); return false; }
  return true;
}