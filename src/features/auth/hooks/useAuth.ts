"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/supabase";
import type { Session } from "@supabase/supabase-js";

// Tracks the current auth session and keeps it in sync with Supabase auth events.
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    authService.getSession().then((s) => {
      if (active) {
        setSession(s);
        setLoading(false);
      }
    });

    const unsubscribe = authService.onAuthStateChange((s) => {
      setSession(s);
      queryClient.invalidateQueries();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [queryClient]);

  return { session, user: session?.user ?? null, loading };
}
