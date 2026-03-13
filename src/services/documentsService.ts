import { supabase, uploadFile, deleteFile, BUCKETS } from "./supabase";
import type { Document } from "@/types";

export const documentsService = {
  async getAll(): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*, event:events(id, title), uploader:users(id, full_name)")
      .order("uploaded_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async upload(
    file: File,
    userId: string,
    meta: { description?: string; category: Document["category"]; eventId?: string }
  ): Promise<Document> {
    const path = `${userId}/${Date.now()}_${file.name}`;
    console.log("1. Subiendo a storage:", path);
    const uploaded = await uploadFile(BUCKETS.DOCUMENTS, path, file);
    console.log("2. Resultado storage:", uploaded);
    if (!uploaded) throw new Error("Storage upload fallido");

    console.log("userId que llega:", userId); console.log("3. Insertando en tabla documents...");
    const { data, error } = await supabase
      .from("documents")
      .insert({
        name: file.name,
        description: meta.description ?? null,
        storage_path: uploaded.storagePath,
        public_url: uploaded.publicUrl,
        file_size: file.size,
        file_type: file.type,
        category: meta.category,
        event_id: meta.eventId ?? null,
        uploaded_by: userId,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log("4. Resultado DB:", JSON.stringify({ data, error }, null, 2)); if (error) alert("DB ERROR: " + JSON.stringify(error));
    if (error) {
      alert("Error DB: " + error.message + " | Code: " + error.code);
      throw error;
    }
    return data;
  },

  async delete(doc: Document): Promise<void> {
    await deleteFile(BUCKETS.DOCUMENTS, doc.storage_path);
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);
    if (error) throw error;
  },

  async download(doc: Document): Promise<void> {
    const a = window.document.createElement("a");
    a.href = doc.public_url;
    a.download = doc.name;
    a.target = "_blank";
    a.click();
  },
};
