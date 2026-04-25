-- =====================================================================
-- Force-fix RLS for the `inquiry-attachments` bucket.
--
-- Why this script exists:
--   In recent Supabase versions, uploading a file inserts into BOTH
--   `storage.objects` AND `storage.prefixes`. If `storage.prefixes` has
--   RLS enabled but no INSERT policy, the upload fails with
--   "new row violates row-level security policy" even though your
--   `storage.objects` policy is correct.
--
-- This script:
--   1. Ensures the bucket exists and is public.
--   2. Wipes every existing policy on `storage.objects` AND
--      `storage.prefixes` that targets this bucket (any leftover
--      policies from earlier scripts can conflict).
--   3. Creates a single permissive ALL-command policy on each table,
--      scoped to this bucket only, applied to `public` so it covers
--      `anon`, `authenticated`, and `service_role`.
--   4. Verifies the result.
--
-- Run this in the Supabase SQL Editor with the default `postgres` role.
-- It is safe to re-run.
-- =====================================================================

-- 1. Bucket
insert into storage.buckets (id, name, public)
values ('inquiry-attachments', 'inquiry-attachments', true)
on conflict (id) do update
  set public = true;

-- 2a. Drop every policy on storage.objects that mentions this bucket.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and (qual ilike '%inquiry-attachments%'
           or with_check ilike '%inquiry-attachments%'
           or policyname ilike '%inquiry%attachments%'
           or policyname ilike '%inquiry-attachments%')
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;

-- 2b. Drop every policy on storage.prefixes that mentions this bucket
--     (table only exists in newer Supabase deployments).
do $$
declare
  pol record;
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'storage' and table_name = 'prefixes'
  ) then
    for pol in
      select policyname
      from pg_policies
      where schemaname = 'storage'
        and tablename  = 'prefixes'
        and (qual ilike '%inquiry-attachments%'
             or with_check ilike '%inquiry-attachments%'
             or policyname ilike '%inquiry%attachments%'
             or policyname ilike '%inquiry-attachments%')
    loop
      execute format('drop policy if exists %I on storage.prefixes', pol.policyname);
    end loop;
  end if;
end $$;

-- 3a. One permissive policy on storage.objects covering ALL commands.
create policy "inquiry_attachments_all_objects"
  on storage.objects
  as permissive
  for all
  to public
  using      (bucket_id = 'inquiry-attachments')
  with check (bucket_id = 'inquiry-attachments');

-- 3b. One permissive policy on storage.prefixes covering ALL commands
--     (only if the table exists).
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'storage' and table_name = 'prefixes'
  ) then
    execute $pol$
      create policy "inquiry_attachments_all_prefixes"
        on storage.prefixes
        as permissive
        for all
        to public
        using      (bucket_id = 'inquiry-attachments')
        with check (bucket_id = 'inquiry-attachments')
    $pol$;
  end if;
end $$;

-- 4. Verification — should return at least 1 row for objects,
--    and 1 row for prefixes if your project has that table.
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'storage'
  and tablename in ('objects', 'prefixes')
  and (qual ilike '%inquiry-attachments%'
       or with_check ilike '%inquiry-attachments%')
order by tablename, policyname;
