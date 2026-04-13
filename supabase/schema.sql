-- ============================================================
-- CINQA TRACKER — DATABASE SCHEMA
-- Run this in Supabase Studio > SQL Editor
-- ============================================================

-- Profiles (mirrors auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz default now()
);

-- Lists (named tables shown in sidebar)
create table if not exists lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Column definitions — field type + config stored as JSONB
create table if not exists list_columns (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade,
  name text not null,
  col_type text not null check (col_type in (
    'text', 'url', 'status', 'dropdown', 'user_ref', 'date', 'number', 'checkbox'
  )),
  config jsonb default '{}',
  position int default 0,
  created_at timestamptz default now()
);

-- Records (rows)
create table if not exists list_records (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade,
  position int default 0,
  created_at timestamptz default now()
);

-- Cell values (EAV model)
create table if not exists record_values (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references list_records(id) on delete cascade,
  column_id uuid references list_columns(id) on delete cascade,
  value text,
  unique(record_id, column_id)
);

-- ============================================================
-- AUTH TRIGGER: auto-create profile on first sign-in
-- SECURITY DEFINER runs as the function owner (postgres),
-- bypassing RLS so the insert always succeeds.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop trigger if exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists idx_list_columns_list_id on list_columns(list_id);
create index if not exists idx_list_records_list_id on list_records(list_id);
create index if not exists idx_record_values_record_id on record_values(record_id);
create index if not exists idx_record_values_column_id on record_values(column_id);
