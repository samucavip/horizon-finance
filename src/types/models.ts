export type Country = "BR" | "US";
export type Currency = "BRL" | "USD" | "EUR";
export type AccountType = "checking" | "savings" | "credit";
export type TransactionType = "income" | "expense" | "transfer";
export type PaymentMethod = "debit" | "credit";

export interface Account {
  id: string;
  name: string;
  country: Country;
  currency: Currency;
  type: AccountType;
  initialBalance: number;
  closingDay?: number | null;
  dueDay?: number | null;
  limit?: number | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentId: string | null;
  budget: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string | null;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  transferPairId?: string | null;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export interface Settings {
  exchangeRate: number;
}
