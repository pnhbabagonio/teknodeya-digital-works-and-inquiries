-- Sets up the `inquiry-attachments` Supabase Storage bucket used by the
-- public inquiry form. Run this once in the Supabase SQL editor for the
-- project that hosts this app.

-- 1. Create the bucket (idempotent). Public so generated URLs are accessible.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inquiry-attachments',
  'inquiry-attachments',
  true,
  10485760, -- 10 MB, matches the 10MB limit enforced in the form
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
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. RLS policies on storage.objects so the public inquiry form can upload.
-- Drop any existing policies with the same name to keep this script idempotent.
drop policy if exists "Public can upload inquiry attachments" on storage.objects;
drop policy if exists "Public can read inquiry attachments" on storage.objects;
drop policy if exists "Authenticated can manage inquiry attachments" on storage.objects;

-- Allow anonymous (and authenticated) clients to INSERT into the bucket.
create policy "Public can upload inquiry attachments"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'inquiry-attachments');

-- Allow anyone to read (the bucket is public, but this makes it explicit).
create policy "Public can read inquiry attachments"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'inquiry-attachments');

-- Allow authenticated admins to update/delete (for cleanup from the dashboard).
create policy "Authenticated can manage inquiry attachments"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'inquiry-attachments')
  with check (bucket_id = 'inquiry-attachments');
