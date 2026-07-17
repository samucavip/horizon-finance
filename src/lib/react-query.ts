import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

// Query key factory — single source of truth for cache keys so invalidations
// stay consistent across features.
export const queryKeys = {
  accounts: ["accounts"] as const,
  categories: ["categories"] as const,
  transactions: ["transactions"] as const,
  goals: ["goals"] as const,
  settings: ["settings"] as const,
  session: ["session"] as const,
};
