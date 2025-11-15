-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create bank_accounts table
create table if not exists public.bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null,
  balance numeric(12, 2) not null default 0,
  provider text,
  logo text,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create credit_cards table
create table if not exists public.credit_cards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  brand text not null,
  balance numeric(12, 2) not null default 0,
  due_day_of_month integer not null check (due_day_of_month >= 1 and due_day_of_month <= 31),
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create income table
create table if not exists public.income (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  source text not null,
  amount numeric(12, 2) not null,
  frequency text not null check (frequency in ('weekly', 'bi-weekly', 'biweekly', 'monthly', 'yearly')),
  category text not null,
  amounts numeric(12, 2)[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create expenses table (handles both expenses and subscriptions)
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(12, 2) not null,
  due_date integer not null check (due_date >= 1 and due_date <= 31),
  category text not null,
  type text not null check (type in ('expense', 'subscription')),
  logo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.bank_accounts enable row level security;
alter table public.credit_cards enable row level security;
alter table public.income enable row level security;
alter table public.expenses enable row level security;
alter table public.profiles enable row level security;

-- Create RLS policies for bank_accounts
create policy "Users can view their own bank accounts"
  on public.bank_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bank accounts"
  on public.bank_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bank accounts"
  on public.bank_accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bank accounts"
  on public.bank_accounts for delete
  using (auth.uid() = user_id);

-- Create RLS policies for credit_cards
create policy "Users can view their own credit cards"
  on public.credit_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own credit cards"
  on public.credit_cards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own credit cards"
  on public.credit_cards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own credit cards"
  on public.credit_cards for delete
  using (auth.uid() = user_id);

-- Create RLS policies for income
create policy "Users can view their own income"
  on public.income for select
  using (auth.uid() = user_id);

create policy "Users can insert their own income"
  on public.income for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own income"
  on public.income for update
  using (auth.uid() = user_id);

create policy "Users can delete their own income"
  on public.income for delete
  using (auth.uid() = user_id);

-- Create RLS policies for expenses
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Create RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create indexes for better query performance
create index if not exists bank_accounts_user_id_idx on public.bank_accounts(user_id);
create index if not exists credit_cards_user_id_idx on public.credit_cards(user_id);
create index if not exists income_user_id_idx on public.income(user_id);
create index if not exists expenses_user_id_idx on public.expenses(user_id);

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_bank_accounts_updated_at
  before update on public.bank_accounts
  for each row execute function public.handle_updated_at();

create trigger handle_credit_cards_updated_at
  before update on public.credit_cards
  for each row execute function public.handle_updated_at();

create trigger handle_income_updated_at
  before update on public.income
  for each row execute function public.handle_updated_at();

create trigger handle_expenses_updated_at
  before update on public.expenses
  for each row execute function public.handle_updated_at();

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();
