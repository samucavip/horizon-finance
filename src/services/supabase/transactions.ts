import { getSupabaseClient } from "./client";
import { requireUserId } from "./session";
import { fromTransaction, toTransaction } from "./mappers";
import type { Transaction, TransactionRow } from "@/types";

const TABLE = "transactions";

export const transactionsService = {
  async list(): Promise<Transaction[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;
    return (data as TransactionRow[]).map(toTransaction);
  },

  async create(tx: Omit<Transaction, "id">): Promise<Transaction> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(fromTransaction(tx, userId))
      .select("*")
      .single();
    if (error) throw error;
    return toTransaction(data as TransactionRow);
  },

  // Bulk insert used by installments and CSV import.
  async createMany(rows: Omit<Transaction, "id">[]): Promise<Transaction[]> {
    if (rows.length === 0) return [];
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(rows.map((t) => fromTransaction(t, userId)))
      .select("*");
    if (error) throw error;
    return (data as TransactionRow[]).map(toTransaction);
  },

  async update(id: string, tx: Omit<Transaction, "id">): Promise<Transaction> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update(fromTransaction(tx, userId))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return toTransaction(data as TransactionRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
