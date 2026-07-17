"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/supabase";
import { queryKeys } from "@/lib/react-query";
import { uid } from "@/utils";
import type { Account, Transaction } from "@/types";

export interface TransferInput {
  fromId: string;
  toId: string;
  fromAmount: number;
  toAmount: number;
  date: string;
  note?: string;
}

// Builds the debit/credit transaction pair for a transfer, linked by a shared
// transferPairId. Pure — exported for testing.
export function buildTransferRows(
  input: TransferInput,
  accounts: Account[],
): Omit<Transaction, "id">[] {
  const from = accounts.find((a) => a.id === input.fromId);
  const to = accounts.find((a) => a.id === input.toId);
  const pairId = uid();
  return [
    {
      accountId: input.fromId, date: input.date,
      description: input.note || `Transferência → ${to?.name ?? ""}`,
      amount: -Math.abs(input.fromAmount), categoryId: null, type: "transfer",
      paymentMethod: "debit", transferPairId: pairId,
    },
    {
      accountId: input.toId, date: input.date,
      description: input.note || `Transferência ← ${from?.name ?? ""}`,
      amount: Math.abs(input.toAmount), categoryId: null, type: "transfer",
      paymentMethod: "debit", transferPairId: pairId,
    },
  ];
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, accounts }: { input: TransferInput; accounts: Account[] }) =>
      transactionsService.createMany(buildTransferRows(input, accounts)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.transactions }),
  });
}
