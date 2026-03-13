import { supabase } from "./supabase";

export const commissionsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("commissions")
      .select("*, members:commission_members(*, user:users(id, full_name)), tasks:commission_tasks(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(name: string, description: string, color: string, userId: string) {
    const { data, error } = await supabase
      .from("commissions")
      .insert({ name, description, color, created_by: userId })
      .select()
      .single();
    if (error) throw error;
    await supabase.from("commission_members").insert({ commission_id: data.id, user_id: userId, role: "lead" });
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("commissions").delete().eq("id", id);
    if (error) throw error;
  },

  async addTask(commissionId: string, title: string, isPrivate: boolean) {
    const { data, error } = await supabase
      .from("commission_tasks")
      .insert({ commission_id: commissionId, title, is_private: isPrivate, status: "pending" })
      .select().single();
    if (error) throw error;
    return data;
  },

  async updateTaskStatus(taskId: string, status: string) {
    const { error } = await supabase.from("commission_tasks").update({ status }).eq("id", taskId);
    if (error) throw error;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase.from("commission_tasks").delete().eq("id", taskId);
    if (error) throw error;
  },

  async addNote(commissionId: string, content: string, isPrivate: boolean, userId: string) {
    const { data, error } = await supabase
      .from("commission_notes")
      .insert({ commission_id: commissionId, content, is_private: isPrivate, created_by: userId })
      .select().single();
    if (error) throw error;
    return data;
  },

  async getNotes(commissionId: string) {
    const { data, error } = await supabase
      .from("commission_notes")
      .select("*")
      .eq("commission_id", commissionId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async deleteNote(noteId: string) {
    const { error } = await supabase.from("commission_notes").delete().eq("id", noteId);
    if (error) throw error;
  },
};