-- ============================================================
-- CINQA TRACKER — ROW LEVEL SECURITY POLICIES
-- Run AFTER schema.sql in Supabase Studio > SQL Editor
-- Roles: viewer (read-only), editor (edit cell values), admin (full access)
-- ============================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table lists enable row level security;
alter table list_columns enable row level security;
alter table list_records enable row level security;
alter table record_values enable row level security;

-- ============================================================
-- HELPER: get current user's role (runs as SECURITY DEFINER
-- so it can read profiles even when RLS restricts it)
-- ============================================================
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

-- ============================================================
-- PROFILES
-- ============================================================
drop policy if exists "profiles: authenticated read all" on profiles;
create policy "profiles: authenticated read all"
  on profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles: own row update" on profiles;
create policy "profiles: own row update"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles: admin update all" on profiles;
create policy "profiles: admin update all"
  on profiles for update
  to authenticated
  using (public.get_my_role() = 'admin');

-- ============================================================
-- LISTS
-- ============================================================
drop policy if exists "lists: authenticated read" on lists;
create policy "lists: authenticated read"
  on lists for select
  to authenticated
  using (true);

drop policy if exists "lists: admin insert" on lists;
create policy "lists: admin insert"
  on lists for insert
  to authenticated
  with check (public.get_my_role() = 'admin');

drop policy if exists "lists: admin update" on lists;
create policy "lists: admin update"
  on lists for update
  to authenticated
  using (public.get_my_role() = 'admin');

drop policy if exists "lists: admin delete" on lists;
create policy "lists: admin delete"
  on lists for delete
  to authenticated
  using (public.get_my_role() = 'admin');

-- ============================================================
-- LIST_COLUMNS
-- ============================================================
drop policy if exists "list_columns: authenticated read" on list_columns;
create policy "list_columns: authenticated read"
  on list_columns for select
  to authenticated
  using (true);

drop policy if exists "list_columns: admin insert" on list_columns;
create policy "list_columns: admin insert"
  on list_columns for insert
  to authenticated
  with check (public.get_my_role() = 'admin');

drop policy if exists "list_columns: admin update" on list_columns;
create policy "list_columns: admin update"
  on list_columns for update
  to authenticated
  using (public.get_my_role() = 'admin');

drop policy if exists "list_columns: admin delete" on list_columns;
create policy "list_columns: admin delete"
  on list_columns for delete
  to authenticated
  using (public.get_my_role() = 'admin');

-- ============================================================
-- LIST_RECORDS
-- admin: full CRUD
-- editor/viewer: SELECT only (editors cannot add/delete rows)
-- ============================================================
drop policy if exists "list_records: authenticated read" on list_records;
create policy "list_records: authenticated read"
  on list_records for select
  to authenticated
  using (true);

drop policy if exists "list_records: authenticated insert" on list_records;
drop policy if exists "list_records: admin insert" on list_records;
create policy "list_records: admin insert"
  on list_records for insert
  to authenticated
  with check (public.get_my_role() = 'admin');

drop policy if exists "list_records: admin delete" on list_records;
create policy "list_records: admin delete"
  on list_records for delete
  to authenticated
  using (public.get_my_role() = 'admin');

-- ============================================================
-- RECORD_VALUES
-- admin + editor: can insert/update (edit cell values)
-- viewer: SELECT only
-- ============================================================
drop policy if exists "record_values: authenticated read" on record_values;
create policy "record_values: authenticated read"
  on record_values for select
  to authenticated
  using (true);

drop policy if exists "record_values: authenticated insert" on record_values;
drop policy if exists "record_values: editor+ insert" on record_values;
create policy "record_values: editor+ insert"
  on record_values for insert
  to authenticated
  with check (public.get_my_role() in ('admin', 'editor'));

drop policy if exists "record_values: authenticated update" on record_values;
drop policy if exists "record_values: editor+ update" on record_values;
create policy "record_values: editor+ update"
  on record_values for update
  to authenticated
  using (public.get_my_role() in ('admin', 'editor'));

drop policy if exists "record_values: admin delete" on record_values;
create policy "record_values: admin delete"
  on record_values for delete
  to authenticated
  using (public.get_my_role() = 'admin');
