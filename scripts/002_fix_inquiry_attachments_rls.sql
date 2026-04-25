-- Fixes the row-level security error when uploading attachments via the
-- public inquiry form. Safe to run multiple times.
--
-- HOW TO RUN:
--   Open your Supabase project -> SQL Editor -> New query, paste this whole
--   file, and click "Run". The result panel should report "Success. No rows
--   returned." After it finishes, retry the inquiry submission.

-- 1. Make sure the bucket exists with the right configuration.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inquiry-attachments',
  'inquiry-attachments',
  true,
  10485760, -- 10 MB, matches the limit enforced in the form
  array[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage RLS is enabled by default on `storage.objects`. Make sure it is
--    on (no-op if already enabled).
alter table storage.objects enable row level security;

-- 3. Drop EVERY policy that targets this bucket (by name OR by definition)
--    so we start from a clean slate. This is the part that fixes the
--    "new row violates row-level security policy" error when an old,
--    restrictive policy is still in place.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and (
        policyname in (
          'Public can upload inquiry attachments',
          'Public can read inquiry attachments',
          'Authenticated can manage inquiry attachments',
          'Anyone can upload to inquiry-attachments',
          'Anyone can view inquiry-attachments'
        )
        or policyname ilike '%inquiry-attachments%'
        or policyname ilike '%inquiry attachments%'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;

-- 4. Recreate the policies. One policy per command so they don't conflict.

-- INSERT: anyone (anon or signed in) can upload into this bucket.
create policy "inquiry_attachments_insert"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'inquiry-attachments');

-- SELECT: anyone can read objects in this bucket (bucket is public anyway).
create policy "inquiry_attachments_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'inquiry-attachments');

-- UPDATE / DELETE: only signed-in users (e.g. admins) can modify or remove.
create policy "inquiry_attachments_update"
  on storage.objects
  for update
  to authenticated
  using      (bucket_id = 'inquiry-attachments')
  with check (bucket_id = 'inquiry-attachments');

create policy "inquiry_attachments_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'inquiry-attachments');

-- 5. Sanity check: list the policies that now apply to this bucket.
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage'
  and tablename  = 'objects'
  and policyname like 'inquiry_attachments_%';
