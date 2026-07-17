import { getSupabaseClient } from "./client";
import { requireUserId } from "./session";
import { DEFAULT_EXCHANGE_RATE } from "@/constants";
import type { Settings, SettingsRow } from "@/types";

const TABLE = "settings";

export const settingsService = {
  async get(): Promise<Settings> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    const row = data as SettingsRow | null;
    return { exchangeRate: row ? Number(row.exchange_rate) : DEFAULT_EXCHANGE_RATE };
  },

  // Upserts the single settings row for the current user.
  async setExchangeRate(exchangeRate: number): Promise<Settings> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .upsert(
        { user_id: userId, exchange_rate: exchangeRate, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();
    if (error) throw error;
    return { exchangeRate: Number((data as SettingsRow).exchange_rate) };
  },
};
