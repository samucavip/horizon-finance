import { getSupabaseClient } from "./client";
import { requireUserId } from "./session";
import { accountsService } from "./accounts";
import { settingsService } from "./settings";
import { C, DEFAULT_EXCHANGE_RATE } from "@/constants";
import { todayISO } from "@/utils";
import type { Account, Category } from "@/types";

// First-run seeding: when a freshly-registered user has no accounts yet, create
// the same starter dataset the original prototype shipped with. Parents are
// inserted before children so parent_id references resolve.
export async function seedDefaultData(): Promise<void> {
  const existing = await accountsService.list();
  if (existing.length > 0) return;

  const userId = await requireUserId();
  const supabase = getSupabaseClient();

  const accounts: Omit<Account, "id">[] = [
    { name: "Nubank", country: "BR", currency: "BRL", type: "checking", initialBalance: 4200 },
    { name: "Chase Checking", country: "US", currency: "USD", type: "checking", initialBalance: 1800 },
    { name: "Nubank Cartão", country: "BR", currency: "BRL", type: "credit", initialBalance: 0, closingDay: 25, dueDay: 5, limit: 8000 },
    { name: "Chase Sapphire", country: "US", currency: "USD", type: "credit", initialBalance: 0, closingDay: 20, dueDay: 10, limit: 5000 },
  ];
  const accountRows = await insertReturning("accounts", accounts.map((a) => ({
    user_id: userId, name: a.name, country: a.country, currency: a.currency, type: a.type,
    initial_balance: a.initialBalance, closing_day: a.closingDay ?? null,
    due_day: a.dueDay ?? null, credit_limit: a.limit ?? null,
  })));

  // Parent categories first.
  const parents: Omit<Category, "id" | "parentId">[] = [
    { name: "Alimentação", color: C.coral, icon: "Utensils", budget: 2500 },
    { name: "Moradia", color: C.steel, icon: "Home", budget: 3200 },
    { name: "Transporte", color: C.amber, icon: "Car", budget: 900 },
    { name: "Saúde", color: C.emerald, icon: "HeartPulse", budget: 600 },
    { name: "Lazer", color: C.violet, icon: "Film", budget: 500 },
    { name: "Assinaturas", color: C.violet, icon: "Wifi", budget: 250 },
    { name: "Salário", color: C.emerald, icon: "Briefcase", budget: 0 },
    { name: "Outros", color: C.slate, icon: "Receipt", budget: 300 },
  ];
  const parentRows = await insertReturning("categories", parents.map((c) => ({
    user_id: userId, name: c.name, color: c.color, icon: c.icon, parent_id: null, budget: c.budget,
  })));
  const parentId = (name: string) => parentRows.find((r) => r.name === name)!.id;

  const children = [
    { name: "Mercado", color: C.coral, icon: "ShoppingCart", parent: "Alimentação" },
    { name: "Restaurante", color: C.coral, icon: "Coffee", parent: "Alimentação" },
    { name: "Combustível", color: C.amber, icon: "Fuel", parent: "Transporte" },
    { name: "App de transporte", color: C.amber, icon: "Car", parent: "Transporte" },
  ];
  const childRows = await insertReturning("categories", children.map((c) => ({
    user_id: userId, name: c.name, color: c.color, icon: c.icon, parent_id: parentId(c.parent), budget: 0,
  })));

  const accId = (name: string) => accountRows.find((r) => r.name === name)!.id;
  const catId = (name: string) =>
    [...parentRows, ...childRows].find((r) => r.name === name)!.id;

  const today = todayISO();
  await supabase.from("transactions").insert([
    { user_id: userId, account_id: accId("Nubank"), date: today, description: "Salário", amount: 9800, category_id: catId("Salário"), type: "income", payment_method: "debit" },
    { user_id: userId, account_id: accId("Nubank Cartão"), date: today, description: "Supermercado Pão de Açúcar", amount: -412.5, category_id: catId("Mercado"), type: "expense", payment_method: "credit" },
    { user_id: userId, account_id: accId("Nubank Cartão"), date: today, description: "iFood", amount: -68.9, category_id: catId("Restaurante"), type: "expense", payment_method: "credit" },
    { user_id: userId, account_id: accId("Nubank"), date: today, description: "Aluguel", amount: -2600, category_id: catId("Moradia"), type: "expense", payment_method: "debit" },
    { user_id: userId, account_id: accId("Chase Checking"), date: today, description: "Salary US freelance", amount: 1200, category_id: catId("Salário"), type: "income", payment_method: "debit" },
    { user_id: userId, account_id: accId("Chase Sapphire"), date: today, description: "Netflix", amount: -15.49, category_id: catId("Assinaturas"), type: "expense", payment_method: "credit" },
  ]);

  await supabase.from("goals").insert([
    { user_id: userId, name: "Reserva de emergência", target: 30000, current: 14500, color: C.emerald },
    { user_id: userId, name: "Viagem Europa", target: 15000, current: 3200, color: C.steel },
  ]);

  await settingsService.setExchangeRate(DEFAULT_EXCHANGE_RATE);
}

async function insertReturning(
  table: string,
  rows: Record<string, unknown>[],
): Promise<{ id: string; name: string }[]> {
  const { data, error } = await getSupabaseClient().from(table).insert(rows).select("id, name");
  if (error) throw error;
  return data as { id: string; name: string }[];
}
