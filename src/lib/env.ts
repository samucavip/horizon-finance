// Centralized access to public environment variables with a clear error when
// Supabase credentials are missing.
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export function assertSupabaseEnv(): void {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase não configurado. Copie .env.local.example para .env.local e preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
