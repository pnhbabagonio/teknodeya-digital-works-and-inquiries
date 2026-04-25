-- Allow authenticated admins/staff to update inquiry status
-- and insert into inquiry_status_history. Also auto-create a
-- profiles row for any auth user so the FK on changed_by holds.
--
-- Safe to re-run.

-- ---------------------------------------------------------------
-- 1. Make sure RLS is enabled on the relevant public tables.
-- ---------------------------------------------------------------
alter table public.inquiries enable row level security;
alter table public.inquiry_status_history enable row level security;
alter table public.profiles enable row level security;

-- ---------------------------------------------------------------
-- 2. profiles policies + auto-create profile on signup
-- ---------------------------------------------------------------
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger that creates a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any existing auth users that don't have one yet.
insert into public.profiles (id, email, full_name)
select u.id, coalesce(u.email, ''), coalesce(u.raw_user_meta_data->>'full_name', null)
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- ---------------------------------------------------------------
-- 3. inquiries policies
--    Public can submit (insert) and authenticated admins/staff can
--    read & update.
-- ---------------------------------------------------------------
drop policy if exists "inquiries_insert_public" on public.inquiries;
create policy "inquiries_insert_public"
  on public.inquiries
  for insert
  to public
  with check (true);

drop policy if exists "inquiries_select_authenticated" on public.inquiries;
create policy "inquiries_select_authenticated"
  on public.inquiries
  for select
  to authenticated
  using (true);

drop policy if exists "inquiries_update_authenticated" on public.inquiries;
create policy "inquiries_update_authenticated"
  on public.inquiries
  for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------
-- 4. inquiry_status_history policies
-- ---------------------------------------------------------------
drop policy if exists "history_select_authenticated" on public.inquiry_status_history;
create policy "history_select_authenticated"
  on public.inquiry_status_history
  for select
  to authenticated
  using (true);

drop policy if exists "history_insert_authenticated" on public.inquiry_status_history;
create policy "history_insert_authenticated"
  on public.inquiry_status_history
  for insert
  to authenticated
  with check (
    -- Either the row carries no author, or the author matches the caller.
    changed_by is null or changed_by = auth.uid()
  );

-- ---------------------------------------------------------------
-- 5. Verification
-- ---------------------------------------------------------------
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('inquiries', 'inquiry_status_history', 'profiles')
order by tablename, policyname;
