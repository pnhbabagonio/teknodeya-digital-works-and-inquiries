-- =====================================================================
-- DIAGNOSE + HARD-FIX RLS for the `inquiry-attachments` storage bucket
-- =====================================================================
-- Run this whole file in the Supabase SQL Editor.
-- It is idempotent and safe to re-run.
-- It prints diagnostics before and after the fix so you can see exactly
-- which policies exist on storage.objects.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. BEFORE: Show every policy currently attached to storage.objects.
--    Look for any RESTRICTIVE policy or an ALL-tables denial that could
--    be blocking anonymous inserts.
-- ---------------------------------------------------------------------
SELECT
  'BEFORE' AS phase,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;


-- ---------------------------------------------------------------------
-- 2. Make sure the bucket exists and is PUBLIC (so the public URL works).
--    If it already exists we update its flags rather than recreate it.
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('inquiry-attachments', 'inquiry-attachments', true)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public;


-- ---------------------------------------------------------------------
-- 3. Drop EVERY policy on storage.objects that mentions our bucket OR
--    that was created by previous attempts (named patterns we used).
--    We only target policies that reference this bucket explicitly,
--    so policies for other buckets are left alone.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND (
            policyname ILIKE '%inquiry%attachment%'
        OR  policyname ILIKE 'inquiry_attachments_%'
        OR  COALESCE(qual, '')       ILIKE '%inquiry-attachments%'
        OR  COALESCE(with_check, '') ILIKE '%inquiry-attachments%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;


-- ---------------------------------------------------------------------
-- 4. Make sure RLS is enabled (Supabase already does this, but be safe).
-- ---------------------------------------------------------------------
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------
-- 5. Create ONE permissive ALL-command policy for this bucket, granted
--    to the `public` PostgreSQL group, which includes `anon`,
--    `authenticated`, and `service_role`. This is the most reliable
--    pattern and avoids the role-name pitfalls that some Supabase
--    versions hit with auth.role().
-- ---------------------------------------------------------------------
CREATE POLICY "inquiry_attachments_all_public"
  ON storage.objects
  AS PERMISSIVE
  FOR ALL
  TO public
  USING      (bucket_id = 'inquiry-attachments')
  WITH CHECK (bucket_id = 'inquiry-attachments');


-- ---------------------------------------------------------------------
-- 6. If the storage.prefixes table exists (newer Supabase versions),
--    apply the same policy there. Older projects don't have this table
--    and will simply skip this block.
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'storage'
      AND table_name   = 'prefixes'
  ) THEN
    EXECUTE 'ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY';

    -- Drop any old policy with the same name to keep this re-runnable.
    EXECUTE 'DROP POLICY IF EXISTS "inquiry_attachments_all_public" ON storage.prefixes';

    EXECUTE $p$
      CREATE POLICY "inquiry_attachments_all_public"
        ON storage.prefixes
        AS PERMISSIVE
        FOR ALL
        TO public
        USING      (bucket_id = 'inquiry-attachments')
        WITH CHECK (bucket_id = 'inquiry-attachments')
    $p$;
  END IF;
END $$;


-- ---------------------------------------------------------------------
-- 7. AFTER: Show the final state. You should see:
--      - exactly one policy named `inquiry_attachments_all_public`
--        on storage.objects (and on storage.prefixes if present)
--      - no other policies referencing 'inquiry-attachments'
-- ---------------------------------------------------------------------
SELECT
  'AFTER' AS phase,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND (
        policyname ILIKE '%inquiry%attachment%'
    OR  COALESCE(qual, '')       ILIKE '%inquiry-attachments%'
    OR  COALESCE(with_check, '') ILIKE '%inquiry-attachments%'
  )
ORDER BY tablename, policyname;


-- ---------------------------------------------------------------------
-- 8. Confirm the bucket is public and visible.
-- ---------------------------------------------------------------------
SELECT id, name, public
FROM storage.buckets
WHERE id = 'inquiry-attachments';
