import { getSupabaseClient } from "./client";
import type { Session, User } from "@supabase/supabase-js";

// Authentication operations. UI/hooks call these — never supabase.auth directly.
export const authService = {
  async getSession(): Promise<Session | null> {
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser(): Promise<User | null> {
    const { data } = await getSupabaseClient().auth.getUser();
    return data.user;
  },

  async signInWithPassword(email: string, password: string): Promise<void> {
    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }> {
    const { data, error } = await getSupabaseClient().auth.signUp({ email, password });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  },

  async signOut(): Promise<void> {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return () => data.subscription.unsubscribe();
  },
};
