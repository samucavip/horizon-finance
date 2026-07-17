import type { Currency } from "@/types";

export function formatCurrency(value: number, currency: Currency): string {
  const locale = currency === "USD" ? "en-US" : currency === "EUR" ? "de-DE" : "pt-BR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

// Converts a value in the given currency into BRL using the USD→BRL rate.
export function toBRL(value: number, currency: Currency, exchangeRate: number): number {
  if (currency === "USD") return value * exchangeRate;
  if (currency === "EUR") return value * exchangeRate * 1.08;
  return value;
}

// Exchange rate applied when transferring between two currencies.
export function transferRate(from: Currency, to: Currency, exchangeRate: number): number {
  if (from === to) return 1;
  if (from === "USD" && to === "BRL") return exchangeRate;
  if (from === "BRL" && to === "USD") return 1 / exchangeRate;
  return 1;
}
