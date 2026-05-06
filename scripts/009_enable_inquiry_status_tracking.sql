-- Enable basic inquiry status tracking.
--
-- Statuses:
-- - new-inquiry
-- - contacted
-- - ongoing-discussion
-- - closed
--
-- Safe to re-run in the Supabase SQL editor.

do $$
declare
  constraint_record record;
begin
  if to_regclass('public.inquiries') is null then
    raise notice 'public.inquiries does not exist yet.';
  else
    alter table public.inquiries
      add column if not exists status text;

    for constraint_record in
      select c.conname
      from pg_constraint c
      join pg_class t on t.oid = c.conrelid
      join pg_namespace n on n.oid = t.relnamespace
      where n.nspname = 'public'
        and t.relname = 'inquiries'
        and c.contype = 'c'
        and pg_get_constraintdef(c.oid) ilike '%status%'
    loop
      execute format(
        'alter table public.inquiries drop constraint %I',
        constraint_record.conname
      );
    end loop;

    update public.inquiries
    set status = case
      when status is null
        or btrim(lower(status::text)) in (
          '',
          'pending',
          'new',
          'new inquiry',
          'new-inquiry',
          'new_inquiry'
        )
        then 'new-inquiry'
      when btrim(lower(status::text)) = 'contacted'
        then 'contacted'
      when btrim(lower(status::text)) in (
          'in-progress',
          'in_progress',
          'ongoing',
          'ongoing discussion',
          'ongoing-discussion'
        )
        then 'ongoing-discussion'
      when btrim(lower(status::text)) in (
          'completed',
          'complete',
          'cancelled',
          'canceled',
          'closed'
        )
        then 'closed'
      else 'new-inquiry'
    end;

    alter table public.inquiries
      alter column status set default 'new-inquiry',
      alter column status set not null;

    alter table public.inquiries
      add constraint inquiries_status_check
      check (status in (
        'new-inquiry',
        'contacted',
        'ongoing-discussion',
        'closed'
      ));
  end if;

  if to_regclass('public.inquiry_status_history') is null then
    raise notice 'public.inquiry_status_history does not exist yet.';
  else
    alter table public.inquiry_status_history
      add column if not exists status text;

    for constraint_record in
      select c.conname
      from pg_constraint c
      join pg_class t on t.oid = c.conrelid
      join pg_namespace n on n.oid = t.relnamespace
      where n.nspname = 'public'
        and t.relname = 'inquiry_status_history'
        and c.contype = 'c'
        and pg_get_constraintdef(c.oid) ilike '%status%'
    loop
      execute format(
        'alter table public.inquiry_status_history drop constraint %I',
        constraint_record.conname
      );
    end loop;

    update public.inquiry_status_history
    set status = case
      when status is null
        or btrim(lower(status::text)) in (
          '',
          'pending',
          'new',
          'new inquiry',
          'new-inquiry',
          'new_inquiry'
        )
        then 'new-inquiry'
      when btrim(lower(status::text)) = 'contacted'
        then 'contacted'
      when btrim(lower(status::text)) in (
          'in-progress',
          'in_progress',
          'ongoing',
          'ongoing discussion',
          'ongoing-discussion'
        )
        then 'ongoing-discussion'
      when btrim(lower(status::text)) in (
          'completed',
          'complete',
          'cancelled',
          'canceled',
          'closed'
        )
        then 'closed'
      else 'new-inquiry'
    end;

    alter table public.inquiry_status_history
      alter column status set not null;

    alter table public.inquiry_status_history
      add constraint inquiry_status_history_status_check
      check (status in (
        'new-inquiry',
        'contacted',
        'ongoing-discussion',
        'closed'
      ));
  end if;
end $$;

select status, count(*) as inquiry_count
from public.inquiries
group by status
order by status;
