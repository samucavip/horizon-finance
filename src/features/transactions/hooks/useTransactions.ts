"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/supabase";
import { queryKeys } from "@/lib/react-query";
import type { Transaction } from "@/types";

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => transactionsService.list(),
  });
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Omit<Transaction, "id">) => transactionsService.create(tx),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useCreateTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: Omit<Transaction, "id">[]) => transactionsService.createMany(rows),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tx }: { id: string; tx: Omit<Transaction, "id"> }) =>
      transactionsService.update(id, tx),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.remove(id),
    onSuccess: () => invalidate(queryClient),
  });
}
