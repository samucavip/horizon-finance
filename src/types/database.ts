// Row shapes as stored in Supabase (snake_case columns). Mappers in the
// services translate these to/from the camelCase domain models in models.ts.

export interface AccountRow {
  id: string;
  user_id: string;
  name: string;
  country: string;
  currency: string;
  type: string;
  initial_balance: number;
  closing_day: number | null;
  due_day: number | null;
  credit_limit: number | null;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  parent_id: string | null;
  budget: number;
  created_at: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  account_id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  type: string;
  payment_method: string;
  transfer_pair_id: string | null;
  created_at: string;
}

export interface GoalRow {
  id: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  deadline: string | null;
  color: string;
  created_at: string;
}

export interface SettingsRow {
  user_id: string;
  exchange_rate: number;
  updated_at: string;
}
