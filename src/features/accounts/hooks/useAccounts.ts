"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "@/services/supabase";
import { queryKeys } from "@/lib/react-query";
import type { Account } from "@/types";

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => accountsService.list(),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (account: Omit<Account, "id">) => accountsService.create(account),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.accounts }),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
