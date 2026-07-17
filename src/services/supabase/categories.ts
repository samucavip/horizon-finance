import { getSupabaseClient } from "./client";
import { requireUserId } from "./session";
import { fromCategory, toCategory } from "./mappers";
import type { Category, CategoryRow } from "@/types";

const TABLE = "categories";

export const categoriesService = {
  async list(): Promise<Category[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map(toCategory);
  },

  async create(category: Omit<Category, "id">): Promise<Category> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(fromCategory(category, userId))
      .select("*")
      .single();
    if (error) throw error;
    return toCategory(data as CategoryRow);
  },

  async update(id: string, category: Omit<Category, "id">): Promise<Category> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update(fromCategory(category, userId))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return toCategory(data as CategoryRow);
  },

  // Deleting a parent cascades to its children via the FK on delete cascade.
  async remove(id: string): Promise<void> {
    const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
