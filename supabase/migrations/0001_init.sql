-- Horizon Finance — initial schema.
-- Every table is scoped to the authenticated user via user_id + Row Level
-- Security so a user can only ever read/write their own financial data.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ accounts
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  country text not null check (country in ('BR', 'US')),
  currency text not null check (currency in ('BRL', 'USD', 'EUR')),
  type text not null check (type in ('checking', 'savings', 'credit')),
  initial_balance numeric(14, 2) not null default 0,
  closing_day int check (closing_day between 1 and 31),
  due_day int check (due_day between 1 and 31),
  credit_limit numeric(14, 2),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#5B6270',
  icon text not null default 'Receipt',
  parent_id uuid references public.categories (id) on delete cascade,
  budget numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  date date not null,
  description text not null default '',
  amount numeric(14, 2) not null,
  category_id uuid references public.categories (id) on delete set null,
  type text not null check (type in ('income', 'expense', 'transfer')),
  payment_method text not null default 'debit' check (payment_method in ('debit', 'credit')),
  transfer_pair_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);
create index if not exists transactions_account_idx
  on public.transactions (account_id);

-- --------------------------------------------------------------------- goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target numeric(14, 2) not null default 0,
  current numeric(14, 2) not null default 0,
  deadline date,
  color text not null default '#1F7A5C',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ settings
create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  exchange_rate numeric(10, 4) not null default 5.4,
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------- row level security
alter table public.accounts     enable row level security;
alter table public.categories   enable row level security;
alter table public.transactions enable row level security;
alter table public.goals        enable row level security;
alter table public.settings     enable row level security;

-- Each policy restricts every operation to rows owned by the current user.
do $$
declare
  t text;
begin
  foreach t in array array['accounts', 'categories', 'transactions', 'goals', 'settings']
  loop
    execute format('drop policy if exists "%1$s_select" on public.%1$s;', t);
    execute format('drop policy if exists "%1$s_insert" on public.%1$s;', t);
    execute format('drop policy if exists "%1$s_update" on public.%1$s;', t);
    execute format('drop policy if exists "%1$s_delete" on public.%1$s;', t);

    execute format('create policy "%1$s_select" on public.%1$s for select using (auth.uid() = user_id);', t);
    execute format('create policy "%1$s_insert" on public.%1$s for insert with check (auth.uid() = user_id);', t);
    execute format('create policy "%1$s_update" on public.%1$s for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
    execute format('create policy "%1$s_delete" on public.%1$s for delete using (auth.uid() = user_id);', t);
  end loop;
end $$;
