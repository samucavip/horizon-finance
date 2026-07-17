import type { Account, Category, Transaction } from "@/types";
import { toBRL } from "./currency";
import { endOfMonthISO, monthKey, todayISO } from "./date";

// Pure financial calculations derived from the raw entities. Kept free of React
// so they can be unit-tested and reused by any feature.

export function accountBalance(
  account: Account,
  transactions: Transaction[],
  upTo?: string,
): number {
  const sum = transactions
    .filter((t) => t.accountId === account.id && (!upTo || t.date <= upTo))
    .reduce((s, t) => s + t.amount, 0);
  return account.initialBalance + sum;
}

export function accountProjected(
  account: Account,
  transactions: Transaction[],
  month: string,
): number {
  return accountBalance(account, transactions, endOfMonthISO(month));
}

export function totalInBRL(
  accounts: Account[],
  transactions: Transaction[],
  exchangeRate: number,
  upTo: string,
): number {
  return accounts.reduce(
    (s, a) => s + toBRL(accountBalance(a, transactions, upTo), a.currency, exchangeRate),
    0,
  );
}

export function totalProjectedInBRL(
  accounts: Account[],
  transactions: Transaction[],
  exchangeRate: number,
  month: string,
): number {
  return accounts.reduce(
    (s, a) => s + toBRL(accountProjected(a, transactions, month), a.currency, exchangeRate),
    0,
  );
}

export function monthTransactions(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter((t) => monthKey(t.date) === month);
}

function currencyOf(accounts: Account[], accountId: string) {
  return accounts.find((a) => a.id === accountId)?.currency ?? "BRL";
}

export function monthIncome(
  monthTx: Transaction[],
  accounts: Account[],
  exchangeRate: number,
): number {
  return monthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + toBRL(t.amount, currencyOf(accounts, t.accountId), exchangeRate), 0);
}

export function monthExpense(
  monthTx: Transaction[],
  accounts: Account[],
  exchangeRate: number,
): number {
  return monthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + toBRL(Math.abs(t.amount), currencyOf(accounts, t.accountId), exchangeRate), 0);
}

// Spending for a category including its subcategories, up to today, in BRL.
export function categorySpent(
  categoryId: string,
  categories: Category[],
  monthTx: Transaction[],
  accounts: Account[],
  exchangeRate: number,
): number {
  const childIds = categories.filter((c) => c.parentId === categoryId).map((c) => c.id);
  const ids = new Set([categoryId, ...childIds]);
  const today = todayISO();
  return monthTx
    .filter((t) => t.categoryId && ids.has(t.categoryId) && t.type === "expense" && t.date <= today)
    .reduce((s, t) => s + toBRL(Math.abs(t.amount), currencyOf(accounts, t.accountId), exchangeRate), 0);
}

export function topLevelCategories(categories: Category[]): Category[] {
  return categories.filter((c) => !c.parentId);
}
