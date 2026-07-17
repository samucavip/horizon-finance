import { getSupabaseClient } from "./client";

// Resolves the current user id, throwing if unauthenticated. Services use it to
// stamp user_id on inserts (RLS also enforces this server-side).
export async function requireUserId(): Promise<string> {
  const { data, error } = await getSupabaseClient().auth.getUser();
  if (error || !data.user) throw new Error("Sessão expirada. Faça login novamente.");
  return data.user.id;
}
