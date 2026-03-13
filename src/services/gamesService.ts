import { supabase } from "./supabase";
import type { Pool, PoolParticipant, LeaderboardEntry } from "@/types";

export const gamesService = {
  async getPools(): Promise<Pool[]> {
    const { data, error } = await supabase
      .from("pools")
      .select("*, participants:pool_participants(*, user:users(*))")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async joinPool(poolId: string, userId: string, prediction?: string): Promise<PoolParticipant> {
    const { data, error } = await supabase
      .from("pool_participants")
      .insert({ pool_id: poolId, user_id: userId, prediction })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("total_points", { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data ?? []).map((row, i) => ({
      rank: i + 1,
      user_id: row.user_id,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      total_points: row.total_points,
      events_participated: row.events_participated,
      pools_won: row.pools_won,
    }));
  },

  async createPool(pool: Omit<Pool, "id" | "created_at" | "participants">): Promise<Pool> {
    const { data, error } = await supabase
      .from("pools")
      .insert(pool)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
