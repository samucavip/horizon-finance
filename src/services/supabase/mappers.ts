import type {
  Account, AccountRow, Category, CategoryRow, Goal, GoalRow,
  Transaction, TransactionRow, AccountType, Country, Currency,
  TransactionType, PaymentMethod,
} from "@/types";

// Row → domain model translation. Keeps snake_case DB columns from leaking into
// the rest of the app.

export function toAccount(r: AccountRow): Account {
  return {
    id: r.id,
    name: r.name,
    country: r.country as Country,
    currency: r.currency as Currency,
    type: r.type as AccountType,
    initialBalance: Number(r.initial_balance),
    closingDay: r.closing_day,
    dueDay: r.due_day,
    limit: r.credit_limit === null ? null : Number(r.credit_limit),
  };
}

export function fromAccount(a: Omit<Account, "id">, userId: string) {
  return {
    user_id: userId,
    name: a.name,
    country: a.country,
    currency: a.currency,
    type: a.type,
    initial_balance: a.initialBalance,
    closing_day: a.closingDay ?? null,
    due_day: a.dueDay ?? null,
    credit_limit: a.limit ?? null,
  };
}

export function toCategory(r: CategoryRow): Category {
  return {
    id: r.id,
    name: r.name,
    color: r.color,
    icon: r.icon,
    parentId: r.parent_id,
    budget: Number(r.budget),
  };
}

export function fromCategory(c: Omit<Category, "id">, userId: string) {
  return {
    user_id: userId,
    name: c.name,
    color: c.color,
    icon: c.icon,
    parent_id: c.parentId,
    budget: c.budget,
  };
}

export function toTransaction(r: TransactionRow): Transaction {
  return {
    id: r.id,
    accountId: r.account_id,
    date: r.date,
    description: r.description,
    amount: Number(r.amount),
    categoryId: r.category_id,
    type: r.type as TransactionType,
    paymentMethod: r.payment_method as PaymentMethod,
    transferPairId: r.transfer_pair_id,
  };
}

export function fromTransaction(t: Omit<Transaction, "id">, userId: string) {
  return {
    user_id: userId,
    account_id: t.accountId,
    date: t.date,
    description: t.description,
    amount: t.amount,
    category_id: t.categoryId,
    type: t.type,
    payment_method: t.paymentMethod,
    transfer_pair_id: t.transferPairId ?? null,
  };
}

export function toGoal(r: GoalRow): Goal {
  return {
    id: r.id,
    name: r.name,
    target: Number(r.target),
    current: Number(r.current),
    deadline: r.deadline ?? "",
    color: r.color,
  };
}

export function fromGoal(g: Omit<Goal, "id">, userId: string) {
  return {
    user_id: userId,
    name: g.name,
    target: g.target,
    current: g.current,
    deadline: g.deadline || null,
    color: g.color,
  };
}
