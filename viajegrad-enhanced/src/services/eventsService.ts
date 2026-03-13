import { supabase } from "./supabase";
import type { Event, EventParticipant } from "@/types";

export const eventsService = {
  async getAll(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("events")
      .select("*, participants:event_participants(*, user:users(*))")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUpcoming(limit = 5): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .eq("status", "upcoming")
      .order("date", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  },

  async create(event: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
    const { data, error } = await supabase
      .from("events")
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from("events")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
  },

  async joinEvent(eventId: string, userId: string): Promise<EventParticipant> {
    const { data, error } = await supabase
      .from("event_participants")
      .insert({ event_id: eventId, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("event_participants")
      .delete()
      .match({ event_id: eventId, user_id: userId });

    if (error) throw error;
  },
};
