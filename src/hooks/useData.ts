"use client";

import { useEffect, useState, useCallback } from "react";
import { financeService } from "@/services/financeService";
import { galleryService } from "@/services/galleryService";
import { documentsService } from "@/services/documentsService";
import { gamesService } from "@/services/gamesService";
import type {
  Transaction,
  FinanceSummary,
  FinanceRow,
  GalleryItem,
  Document,
  Pool,
  LeaderboardEntry,
} from "@/types";

// ─── Finance ─────────────────────────────────────────────────────────────────
export function useFinance() {
  const [rows, setRows] = useState<FinanceRow[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [rowData, txData, summaryData] = await Promise.all([
        financeService.getByEvent(),
        financeService.getAll(),
        financeService.getSummary(),
      ]);
      setRows(rowData);
      setTransactions(txData);
      setSummary(summaryData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTransaction = async (tx: Omit<Transaction, "id" | "created_at">) => {
    const created = await financeService.create(tx);
    setTransactions((prev) => [created, ...prev]);
    await load(); // refresh summary & rows
    return created;
  };

  return { rows, transactions, summary, loading, error, addTransaction, refresh: load };
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export function useGallery(eventId?: string) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await galleryService.getAll(eventId);
    setItems(data);
    setLoading(false);
  }, [eventId]);

  useEffect(() => { load(); }, [load]);

  const uploadItem = async (file: File, userId: string, evId?: string) => {
    const item = await galleryService.upload(file, userId, evId);
    setItems((prev) => [item, ...prev]);
    return item;
  };

  const deleteItem = async (item: GalleryItem) => {
    await galleryService.delete(item);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return { items, loading, uploadItem, deleteItem, refresh: load };
}

// ─── Documents ───────────────────────────────────────────────────────────────
export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await documentsService.getAll();
    setDocuments(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadDocument = async (
    file: File,
    userId: string,
    meta: { description?: string; category: Document["category"]; eventId?: string }
  ) => {
    const doc = await documentsService.upload(file, userId, meta);
    setDocuments((prev) => [doc, ...prev]);
    return doc;
  };

  const deleteDocument = async (doc: Document) => {
    await documentsService.delete(doc);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  return { documents, loading, uploadDocument, deleteDocument };
}

// ─── Games ───────────────────────────────────────────────────────────────────
export function useGames() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [poolData, lbData] = await Promise.all([
      gamesService.getPools(),
      gamesService.getLeaderboard(),
    ]);
    setPools(poolData);
    setLeaderboard(lbData);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const joinPool = async (poolId: string, userId: string, prediction?: string) => {
    const participant = await gamesService.joinPool(poolId, userId, prediction);
    await load();
    return participant;
  };

  return { pools, leaderboard, loading, joinPool, refresh: load };
}
