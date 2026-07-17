"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/supabase";
import { queryKeys } from "@/lib/react-query";
import { DEFAULT_EXCHANGE_RATE } from "@/constants";
import type { Settings } from "@/types";

export function useSettings() {
  const query = useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => settingsService.get(),
  });

  const exchangeRate = query.data?.exchangeRate ?? DEFAULT_EXCHANGE_RATE;
  return { ...query, exchangeRate };
}

export function useUpdateExchangeRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rate: number) => settingsService.setExchangeRate(rate),
    onSuccess: (settings: Settings) => {
      queryClient.setQueryData(queryKeys.settings, settings);
    },
  });
}
