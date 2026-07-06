alter table public.user_accounts enable row level security;
alter table public.vip_downloads enable row level security;
alter table public.vip_courses enable row level security;
alter table public.suppliers enable row level security;
alter table public.drinks enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.stock_movements enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.review_likes enable row level security;
alter table public.review_replies enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.user_favorites enable row level security;
alter table public.loyalty_points enable row level security;
alter table public.staff_assignments enable row level security;

create policy if not exists "Users can read own profile"
  on public.user_accounts for select
  using (
    auth.uid() = auth_id or public.is_admin_or_manager()
  );

create policy if not exists "Users can update own profile"
  on public.user_accounts for update
  using (auth.uid() = auth_id)
  with check (auth.uid() = auth_id);

create policy if not exists "Admins manage all profiles"
  on public.user_accounts for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Public read downloads"
  on public.vip_downloads for select using (true);
create policy if not exists "Admins manage downloads"
  on public.vip_downloads for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Public read courses"
  on public.vip_courses for select using (true);
create policy if not exists "Admins manage courses"
  on public.vip_courses for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Public read drinks"
  on public.drinks for select using (true);
create policy if not exists "Admins manage drinks"
  on public.drinks for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Public read suppliers"
  on public.suppliers for select using (true);
create policy if not exists "Admins manage suppliers"
  on public.suppliers for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Users read own orders"
  on public.orders for select
  using (
    user_id = (select id from public.user_accounts where auth_id = auth.uid())
    or public.is_admin_or_manager()
  );
create policy if not exists "Users create own orders"
  on public.orders for insert
  with check (
    auth.uid() is not null and (
      user_id = (select id from public.user_accounts where auth_id = auth.uid())
      or public.is_admin_or_manager()
    )
  );
create policy if not exists "Users update own orders"
  on public.orders for update
  using (
    user_id = (select id from public.user_accounts where auth_id = auth.uid())
    or public.is_admin_or_manager()
  )
  with check (
    user_id = (select id from public.user_accounts where auth_id = auth.uid())
    or public.is_admin_or_manager()
  );

create policy if not exists "Users read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          o.user_id = (select id from public.user_accounts where auth_id = auth.uid())
          or public.is_admin_or_manager()
        )
    )
  );
create policy if not exists "Users manage own order items"
  on public.order_items for all
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          o.user_id = (select id from public.user_accounts where auth_id = auth.uid())
          or public.is_admin_or_manager()
        )
    )
  )
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          o.user_id = (select id from public.user_accounts where auth_id = auth.uid())
          or public.is_admin_or_manager()
        )
    )
  );

create policy if not exists "Users read own order status history"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_status_history.order_id
        and (
          o.user_id = (select id from public.user_accounts where auth_id = auth.uid())
          or public.is_admin_or_manager()
        )
    )
  );

create policy if not exists "Admins manage stock movements"
  on public.stock_movements for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Public read coupons"
  on public.coupons for select using (true);
create policy if not exists "Admins manage coupons"
  on public.coupons for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Public read reviews"
  on public.reviews for select using (true);
create policy if not exists "Authenticated users create reviews"
  on public.reviews for insert
  with check (auth.uid() is not null);
create policy if not exists "Users update own reviews"
  on public.reviews for update
  using (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager())
  with check (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager());
create policy if not exists "Users delete own reviews"
  on public.reviews for delete
  using (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager());

create policy if not exists "Public read review likes"
  on public.review_likes for select using (true);
create policy if not exists "Authenticated users manage review likes"
  on public.review_likes for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy if not exists "Public read review replies"
  on public.review_replies for select using (true);
create policy if not exists "Authenticated users create replies"
  on public.review_replies for insert
  with check (auth.uid() is not null);
create policy if not exists "Users update own replies"
  on public.review_replies for update
  using (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager())
  with check (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager());

create policy if not exists "Admins read audit logs"
  on public.audit_logs for select using (public.is_admin_or_manager());
create policy if not exists "Authenticated users create audit logs"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

create policy if not exists "Users read own notifications"
  on public.notifications for select
  using (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager());
create policy if not exists "Admins manage notifications"
  on public.notifications for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Users manage own favorites"
  on public.user_favorites for all
  using (user_id = (select id from public.user_accounts where auth_id = auth.uid()))
  with check (user_id = (select id from public.user_accounts where auth_id = auth.uid()));

create policy if not exists "Users read own loyalty points"
  on public.loyalty_points for select
  using (user_id = (select id from public.user_accounts where auth_id = auth.uid()) or public.is_admin_or_manager());
create policy if not exists "Admins manage loyalty points"
  on public.loyalty_points for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

create policy if not exists "Admins manage staff assignments"
  on public.staff_assignments for all
  using (public.is_admin_or_manager())
  with check (public.is_admin_or_manager());

grant usage on schema public to anon, authenticated, service_role;
grant select on public.drinks to anon, authenticated;
grant select on public.vip_downloads to anon, authenticated;
grant select on public.vip_courses to anon, authenticated;
grant select on public.coupons to anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant select on public.review_likes to anon, authenticated;
grant select on public.review_replies to anon, authenticated;
grant select on public.user_accounts to authenticated;
grant insert, update, delete on public.user_accounts to authenticated, service_role;
grant insert, update, delete on public.vip_downloads to authenticated, service_role;
grant insert, update, delete on public.vip_courses to authenticated, service_role;
grant insert, update, delete on public.suppliers to authenticated, service_role;
grant insert, update, delete on public.drinks to authenticated, service_role;
grant insert, update, delete on public.orders to authenticated, service_role;
grant insert, update, delete on public.order_items to authenticated, service_role;
grant insert, update, delete on public.order_status_history to authenticated, service_role;
grant insert, update, delete on public.stock_movements to authenticated, service_role;
grant insert, update, delete on public.coupons to authenticated, service_role;
grant insert, update, delete on public.reviews to authenticated, service_role;
grant insert, update, delete on public.review_likes to authenticated, service_role;
grant insert, update, delete on public.review_replies to authenticated, service_role;
grant insert, update, delete on public.audit_logs to authenticated, service_role;
grant insert, update, delete on public.notifications to authenticated, service_role;
grant insert, update, delete on public.user_favorites to authenticated, service_role;
grant insert, update, delete on public.loyalty_points to authenticated, service_role;
grant insert, update, delete on public.staff_assignments to authenticated, service_role;
