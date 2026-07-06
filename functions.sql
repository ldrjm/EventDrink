create or replace function public.is_admin_or_manager()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_accounts ua
    where ua.auth_id = auth.uid()
      and ua.role in ('ADMIN', 'GERENTE')
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_badge_id uuid;
  v_user_id uuid;
begin
  select id into v_badge_id
  from public.user_badges
  where slug = 'basic-organizer'
  limit 1;

  insert into public.user_accounts (
    auth_id,
    name,
    email,
    role,
    badge_id,
    is_active,
    events_count
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'FREE',
    v_badge_id,
    true,
    0
  )
  on conflict (auth_id) do nothing;

  select id into v_user_id
  from public.user_accounts
  where auth_id = new.id
  limit 1;

  if v_user_id is not null then
    insert into public.loyalty_points (user_id, points)
    values (v_user_id, 0)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists set_user_accounts_updated_at on public.user_accounts;
create trigger set_user_accounts_updated_at
before update on public.user_accounts
for each row execute function public.set_updated_at();
