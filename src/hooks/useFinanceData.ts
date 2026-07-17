"use client";

import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useSettings } from "@/features/settings";
import type { Account, Category, Transaction } from "@/types";

interface FinanceData {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  exchangeRate: number;
  isLoading: boolean;
  isError: boolean;
}

// Aggregates the core datasets a view typically needs. TanStack Query dedupes
// the underlying requests, so calling this from multiple components is cheap.
export function useFinanceData(): FinanceData {
  const accounts = useAccounts();
  const categories = useCategories();
  const transactions = useTransactions();
  const settings = useSettings();

  return {
    accounts: accounts.data ?? [],
    categories: categories.data ?? [],
    transactions: transactions.data ?? [],
    exchangeRate: settings.exchangeRate,
    isLoading: accounts.isLoading || categories.isLoading || transactions.isLoading || settings.isLoading,
    isError: accounts.isError || categories.isError || transactions.isError || settings.isError,
  };
}
