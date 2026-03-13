"use client";

import { useEffect, useState, useCallback } from "react";
import { eventsService } from "@/services/eventsService";
import type { Event } from "@/types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createEvent = async (event: Omit<Event, "id" | "created_at" | "updated_at">) => {
    const created = await eventsService.create(event);
    setEvents((prev) => [created, ...prev]);
    return created;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const updated = await eventsService.update(id, updates);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEvent = async (id: string) => {
    await eventsService.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { events, loading, error, createEvent, updateEvent, deleteEvent, refresh: load };
}

export function useUpcomingEvents(limit = 5) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsService.getUpcoming(limit).then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, [limit]);

  return { events, loading };
}
