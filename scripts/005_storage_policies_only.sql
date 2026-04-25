-- =====================================================================
-- Inquiry attachments storage RLS - policy-only version
-- Safe for the Supabase SQL Editor (no ALTER TABLE / DISABLE RLS).
-- Run this in the SQL Editor.
-- =====================================================================

-- 1. Ensure the bucket exists and is public.
--    Insert into storage.buckets is allowed for project owners.
insert into storage.buckets (id, name, public, file_size_limit)
values ('inquiry-attachments', 'inquiry-attachments', true, 10485760)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- 2. Drop every prior policy we may have created on storage.objects
--    that is scoped to this bucket. We only drop our own policy names so
--    we never touch policies created by Supabase itself.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname in (
        'inquiry_attachments_anon_insert',
        'inquiry_attachments_anon_select',
        'inquiry_attachments_anon_update',
        'inquiry_attachments_anon_delete',
        'inquiry_attachments_public_insert',
        'inquiry_attachments_public_select',
        'inquiry_attachments_public_update',
        'inquiry_attachments_public_delete',
        'inquiry_attachments_all_public',
        'inquiry_attachments_all',
        'Allow public uploads to inquiry-attachments',
        'Allow public reads from inquiry-attachments',
        'Allow public updates to inquiry-attachments',
        'Allow public deletes from inquiry-attachments'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end$$;

-- 3. Same cleanup for storage.prefixes if that table exists in your project
--    (newer Supabase projects have it; older ones don't).
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
        and tablename = 'prefixes'
        and policyname in (
          'inquiry_attachments_prefixes_all',
          'inquiry_attachments_prefixes_public'
        )
    loop
      execute format('drop policy if exists %I on storage.prefixes', pol.policyname);
    end loop;
  end if;
end$$;

-- 4. Recreate ONE permissive policy per command on storage.objects.
--    These are split (not FOR ALL) because some Supabase projects reject
--    a single FOR ALL policy on storage.objects when run from the SQL editor.
create policy "inquiry_attachments_public_insert"
  on storage.objects for insert
  to public
  with check (bucket_id = 'inquiry-attachments');

create policy "inquiry_attachments_public_select"
  on storage.objects for select
  to public
  using (bucket_id = 'inquiry-attachments');

create policy "inquiry_attachments_public_update"
  on storage.objects for update
  to public
  using (bucket_id = 'inquiry-attachments')
  with check (bucket_id = 'inquiry-attachments');

create policy "inquiry_attachments_public_delete"
  on storage.objects for delete
  to public
  using (bucket_id = 'inquiry-attachments');

-- 5. If storage.prefixes exists, give it matching access for this bucket.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'storage' and table_name = 'prefixes'
  ) then
    execute $p$
      create policy "inquiry_attachments_prefixes_public"
        on storage.prefixes for all
        to public
        using (bucket_id = 'inquiry-attachments')
        with check (bucket_id = 'inquiry-attachments')
    $p$;
  end if;
end$$;

-- 6. Verification - both queries should return rows.
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage'
  and tablename in ('objects', 'prefixes')
  and policyname like 'inquiry_attachments_%'
order by tablename, policyname;

select id, name, public, file_size_limit
from storage.buckets
where id = 'inquiry-attachments';
