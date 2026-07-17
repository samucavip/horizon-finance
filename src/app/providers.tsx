"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/react-query";

export function Providers({ children }: { children: ReactNode }) {
  // One QueryClient per browser session, created lazily so it is stable across
  // re-renders but never shared between requests on the server.
  const [queryClient] = useState(makeQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
