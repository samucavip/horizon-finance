import type { AccountType, Country, Currency, PaymentMethod, TransactionType } from "@/types";

export const DEFAULT_EXCHANGE_RATE = 5.4;

export const COUNTRY_OPTIONS: { value: Country; label: string; currency: Currency }[] = [
  { value: "BR", label: "Brasil", currency: "BRL" },
  { value: "US", label: "Estados Unidos", currency: "USD" },
];

export const CURRENCY_OPTIONS: Currency[] = ["BRL", "USD", "EUR"];

export const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "checking", label: "Conta corrente" },
  { value: "savings", label: "Poupança" },
  { value: "credit", label: "Cartão de crédito" },
];

export const TRANSACTION_TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
];

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "debit", label: "Débito" },
  { value: "credit", label: "Crédito" },
];

export const MAX_INSTALLMENTS = 24;
