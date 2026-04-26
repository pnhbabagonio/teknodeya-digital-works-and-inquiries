-- Add a saved admin avatar icon preference to profiles.
-- Safe to re-run.

alter table public.profiles
  add column if not exists avatar_icon text;

update public.profiles
set avatar_icon = 'user'
where avatar_icon is null
  or avatar_icon not in (
    'user',
    'circle-user',
    'smile',
    'sparkles',
    'rocket',
    'code',
    'palette',
    'briefcase',
    'shield',
    'crown'
  );

alter table public.profiles
  alter column avatar_icon set default 'user',
  alter column avatar_icon set not null;

alter table public.profiles
  drop constraint if exists profiles_avatar_icon_check;

alter table public.profiles
  add constraint profiles_avatar_icon_check
  check (
    avatar_icon in (
      'user',
      'circle-user',
      'smile',
      'sparkles',
      'rocket',
      'code',
      'palette',
      'briefcase',
      'shield',
      'crown'
    )
  );
