import { getSupabaseClient } from "./client";
import { requireUserId } from "./session";
import { fromGoal, toGoal } from "./mappers";
import type { Goal, GoalRow } from "@/types";

const TABLE = "goals";

export const goalsService = {
  async list(): Promise<Goal[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as GoalRow[]).map(toGoal);
  },

  async create(goal: Omit<Goal, "id">): Promise<Goal> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(fromGoal(goal, userId))
      .select("*")
      .single();
    if (error) throw error;
    return toGoal(data as GoalRow);
  },

  async update(id: string, goal: Omit<Goal, "id">): Promise<Goal> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update(fromGoal(goal, userId))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return toGoal(data as GoalRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
