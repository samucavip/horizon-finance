import { getSupabaseClient } from "./client";
import { requireUserId } from "./session";
import { fromAccount, toAccount } from "./mappers";
import type { Account, AccountRow } from "@/types";

const TABLE = "accounts";

export const accountsService = {
  async list(): Promise<Account[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as AccountRow[]).map(toAccount);
  },

  async create(account: Omit<Account, "id">): Promise<Account> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(fromAccount(account, userId))
      .select("*")
      .single();
    if (error) throw error;
    return toAccount(data as AccountRow);
  },

  async update(id: string, account: Omit<Account, "id">): Promise<Account> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update(fromAccount(account, userId))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return toAccount(data as AccountRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
