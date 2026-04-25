-- Allow authenticated users to manage their own dashboard notifications.
--
-- Safe to re-run. If the notifications table has not been created yet, this
-- script only prints a notice and exits.

do $$
begin
  if to_regclass('public.notifications') is null then
    raise notice 'public.notifications does not exist yet. Create the notifications table first, then rerun this script.';
  else
    execute 'alter table public.notifications enable row level security';

    execute 'drop policy if exists "notifications_select_own" on public.notifications';
    execute 'create policy "notifications_select_own"
      on public.notifications
      for select
      to authenticated
      using (user_id = auth.uid())';

    execute 'drop policy if exists "notifications_update_own" on public.notifications';
    execute 'create policy "notifications_update_own"
      on public.notifications
      for update
      to authenticated
      using (user_id = auth.uid())
      with check (user_id = auth.uid())';

    execute 'drop policy if exists "notifications_delete_own" on public.notifications';
    execute 'create policy "notifications_delete_own"
      on public.notifications
      for delete
      to authenticated
      using (user_id = auth.uid())';
  end if;
end $$;

select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'notifications'
order by policyname;
