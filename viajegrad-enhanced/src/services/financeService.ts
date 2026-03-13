import { supabase } from "./supabase";
import type { Transaction, FinanceSummary, FinanceRow } from "@/types";

export const financeService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, event:events(id, title), responsible:users(id, full_name)")
      .order("date", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getSummary(): Promise<FinanceSummary> {
    const { data, error } = await supabase
      .from("transactions")
      .select("type, amount");

    if (error) throw error;

    const transactions = data ?? [];
    const total_income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const total_expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const goal = 15000; // Fetch from settings table in production
    const net = total_income - total_expenses;

    return {
      total_income,
      total_expenses,
      net,
      goal,
      progress_percentage: Math.min(Math.round((net / goal) * 100), 100),
    };
  },

  async getByEvent(): Promise<FinanceRow[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, event:events(id, title), responsible:users(id, full_name)")
      .order("date", { ascending: false });

    if (error) throw error;

    // Group by event
    const grouped = new Map<string, FinanceRow>();
    for (const t of data ?? []) {
      const key = t.event?.title ?? "General";
      const existing = grouped.get(key) ?? {
        event: key,
        income: 0,
        expenses: 0,
        net: 0,
        responsible: t.responsible?.full_name ?? "—",
        date: t.date,
      };
      if (t.type === "income") existing.income += t.amount;
      else existing.expenses += t.amount;
      existing.net = existing.income - existing.expenses;
      grouped.set(key, existing);
    }

    return Array.from(grouped.values());
  },

  async create(transaction: Omit<Transaction, "id" | "created_at">): Promise<Transaction> {
    const { data, error } = await supabase
      .from("transactions")
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;
  },
};
