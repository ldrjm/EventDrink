create extension if not exists pgcrypto;

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.drink_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_pt text not null,
  name_en text not null,
  label_pt text not null,
  label_en text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_statuses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_pt text not null,
  name_en text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  password text not null,
  phone text,
  birth_date date,
  badge_id uuid references public.user_badges(id) on delete set null,
  role text not null check (role in ('FREE', 'VIP', 'ADMIN', 'GERENTE', 'FUNCIONARIO', 'CLIENTE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true,
  events_count integer not null default 0
);

create table if not exists public.vip_downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null,
  format text not null,
  size text not null,
  downloads integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vip_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  duration text not null,
  difficulty text not null,
  image_url text not null,
  views text not null default '0',
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drinks (
  id uuid primary key default gen_random_uuid(),
  name_pt text not null,
  name_en text not null,
  category_id uuid not null references public.drink_categories(id) on delete restrict,
  category_label_pt text not null,
  category_label_en text not null,
  price numeric(10,2) not null default 0,
  image_url text not null,
  recommended_pt text,
  recommended_en text,
  in_stock boolean not null default true,
  unit_pt text not null,
  unit_en text not null,
  stock_quantity integer not null default 0,
  min_stock_quantity integer not null default 0,
  purchase_price numeric(10,2) not null default 0,
  supplier_id uuid references public.suppliers(id) on delete set null,
  expiry_date date,
  batch text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_accounts(id) on delete set null,
  user_email text,
  name_pt text not null,
  name_en text not null,
  date_pt text not null,
  date_en text not null,
  guests integer not null default 0,
  saved_amount numeric(10,2) not null default 0,
  status_id uuid not null references public.order_statuses(id) on delete restrict,
  rating integer not null default 0,
  score numeric(3,1) not null default 0,
  total numeric(10,2) not null default 0,
  image_url text not null,
  address text,
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  drink_id uuid references public.drinks(id) on delete set null,
  quantity integer not null default 1,
  price numeric(10,2) not null default 0,
  name_pt text not null,
  name_en text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status_id uuid not null references public.order_statuses(id) on delete restrict,
  changed_at timestamptz not null default now(),
  note_pt text,
  note_en text,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  drink_id uuid not null references public.drinks(id) on delete cascade,
  drink_name_pt text not null,
  quantity integer not null default 0,
  type text not null check (type in ('in', 'out')),
  reason_pt text not null,
  reason_en text not null,
  date timestamptz not null default now(),
  user_id uuid references public.user_accounts(id) on delete set null,
  user_email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percent', 'fixed', 'free_shipping')),
  value numeric(10,2) not null default 0,
  start_date date not null,
  end_date date not null,
  min_order_value numeric(10,2) not null default 0,
  max_uses integer not null default 100,
  used_count integer not null default 0,
  max_per_user integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  drink_id uuid not null references public.drinks(id) on delete cascade,
  user_id uuid references public.user_accounts(id) on delete set null,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  photo_url text,
  date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_likes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_email text not null,
  created_at timestamptz not null default now(),
  primary key (review_id, user_email)
);

create table if not exists public.review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid references public.user_accounts(id) on delete set null,
  author text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_accounts(id) on delete set null,
  user_email text not null,
  action_pt text not null,
  action_en text not null,
  date date not null default current_date,
  hour text not null default to_char(now(), 'HH24:MI'),
  ip text not null default '0.0.0.0',
  browser text not null default 'Unknown',
  device text not null default 'Unknown',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_accounts(id) on delete cascade,
  title_pt text not null,
  title_en text not null,
  description_pt text not null,
  description_en text not null,
  date date not null default current_date,
  is_read boolean not null default false,
  type text not null check (type in ('order', 'promo', 'stock', 'loyalty', 'coupon')),
  created_at timestamptz not null default now()
);

create table if not exists public.user_favorites (
  user_id uuid not null references public.user_accounts(id) on delete cascade,
  drink_id uuid not null references public.drinks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, drink_id)
);

create table if not exists public.loyalty_points (
  user_id uuid primary key references public.user_accounts(id) on delete cascade,
  points integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references public.user_accounts(id) on delete set null,
  bartenders_count integer not null default 1,
  created_at timestamptz not null default now()
);

insert into public.user_badges (slug, name)
values
  ('premium-host', 'Premium Host'),
  ('vip-member', 'VIP Member'),
  ('basic-organizer', 'Basic Organizer'),
  ('gerente-geral', 'Gerente Geral'),
  ('funcionario-operacional', 'Funcionário Operacional')
on conflict (slug) do nothing;

insert into public.drink_categories (slug, name_pt, name_en, label_pt, label_en)
values
  ('beers', 'Cervejas', 'Beers', 'Cervejas & Chopp', 'Beers & Drafts'),
  ('wines', 'Vinhos', 'Wines', 'Vinhos & Espumantes', 'Wines & Sparklings'),
  ('spirits', 'Destilados', 'Spirits', 'Destilados & Vodkas', 'Spirits & Vodkas'),
  ('non_alcoholic', 'Sem Álcool', 'Non Alcoholic', 'Refrigerantes & Sucos', 'Sodas & Juices')
on conflict (slug) do nothing;

insert into public.order_statuses (slug, name_pt, name_en)
values
  ('received', 'Recebido', 'Received'),
  ('analyzing', 'Analisando', 'Analyzing'),
  ('preparing', 'Preparando', 'Preparing'),
  ('ready', 'Pronto', 'Ready'),
  ('shipped', 'Enviado', 'Shipped'),
  ('delivered', 'Entregue', 'Delivered'),
  ('finalized', 'Finalizado', 'Finalized')
on conflict (slug) do nothing;

create index if not exists idx_user_accounts_email on public.user_accounts (email);
create index if not exists idx_user_accounts_role on public.user_accounts (role);
create index if not exists idx_drinks_category on public.drinks (category_id);
create index if not exists idx_drinks_status on public.drinks (status);
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status_id);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_stock_movements_drink_id on public.stock_movements (drink_id);
create index if not exists idx_reviews_drink_id on public.reviews (drink_id);
create index if not exists idx_reviews_user_id on public.reviews (user_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id);
create index if not exists idx_notifications_is_read on public.notifications (is_read);
