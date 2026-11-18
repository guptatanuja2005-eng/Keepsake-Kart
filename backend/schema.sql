-- Keepsake Kart backend schema for Supabase (PostgreSQL).
-- DRAFT: written without access to a live database, so it has NOT been run or tested.
-- Review it, run it in the Supabase SQL editor on a test project first, and fix anything that errors.
-- The website does not use this yet. It is the server side of Phase 5.

create table public.products (
  id          text primary key,
  name        text not null,
  price       integer not null check (price >= 0),
  category    text not null,
  brand       text not null default 'Hot Wheels',
  description text not null default '',
  color       text not null default '#C9A45C',
  images      jsonb not null default '[]'::jsonb,
  stock_qty   integer not null default 0 check (stock_qty >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.shipping_options (
  label  text primary key,
  price  integer not null check (price >= 0),
  active boolean not null default true
);

create table public.coupons (
  code         text primary key,
  kind         text not null check (kind in ('percent', 'flat')),
  value        integer not null check (value > 0),
  min_subtotal integer not null default 0,
  max_discount integer,
  expires_on   date,
  active       boolean not null default true
);

create table public.orders (
  id         text primary key,
  user_id    uuid references auth.users (id),
  created_at timestamptz not null default now(),
  status     text not null default 'Awaiting confirmation',
  items      jsonb not null,
  subtotal   integer not null,
  discount   integer not null default 0,
  coupon     text,
  shipping   integer not null,
  ship_label text not null,
  total      integer not null,
  payment    text not null,
  customer   jsonb not null
);

create table public.reviews (
  id         bigint generated always as identity primary key,
  product_id text not null references public.products (id) on delete cascade,
  name       text not null check (char_length(name) between 2 and 60),
  rating     integer not null check (rating between 1 and 5),
  body       text not null check (char_length(body) between 5 and 1000),
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row level security: visitors can read active products and approved reviews, and submit unapproved reviews.
-- Orders are readable only by their signed-in owner. Coupons and shipping options have no public policy.
alter table public.products         enable row level security;
alter table public.shipping_options enable row level security;
alter table public.coupons          enable row level security;
alter table public.orders           enable row level security;
alter table public.reviews          enable row level security;

create policy "products are public"      on public.products for select using (active);
create policy "approved reviews public"  on public.reviews  for select using (approved);
create policy "anyone can submit review" on public.reviews  for insert with check (approved = false);
create policy "owner reads own orders"   on public.orders   for select using (auth.uid() = user_id);

-- Places an order on the server: checks stock, takes prices, shipping and coupons from the database
-- (never from the browser), reduces stock atomically and saves the order. Returns the order id.
create or replace function public.place_order(
  p_items      jsonb,    -- [{"id":"camaro10","qty":2}]
  p_ship_label text,
  p_payment    text,
  p_coupon     text,
  p_customer   jsonb
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  it    jsonb;
  prod  public.products%rowtype;
  cp    public.coupons%rowtype;
  q     integer;
  lines jsonb   := '[]'::jsonb;
  sub   integer := 0;
  disc  integer := 0;
  ship  integer;
  oid   text;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  select price into ship from public.shipping_options where label = p_ship_label and active;
  if ship is null then raise exception 'Unknown shipping option'; end if;

  for it in select value from jsonb_array_elements(p_items) loop
    q := (it ->> 'qty')::integer;
    if q is null or q < 1 or q > 10 then raise exception 'Invalid quantity'; end if;

    select * into prod from public.products where id = it ->> 'id' and active for update;
    if not found then raise exception 'Unknown product %', it ->> 'id'; end if;
    if prod.stock_qty < q then raise exception 'Not enough stock for %', prod.name; end if;

    update public.products set stock_qty = stock_qty - q where id = prod.id;
    lines := lines || jsonb_build_object('id', prod.id, 'name', prod.name, 'price', prod.price, 'qty', q);
    sub := sub + prod.price * q;
  end loop;

  if coalesce(p_coupon, '') <> '' then
    select * into cp from public.coupons
      where upper(code) = upper(p_coupon) and active and (expires_on is null or expires_on >= current_date);
    if found and sub >= cp.min_subtotal then
      disc := case cp.kind when 'percent' then round(sub * cp.value / 100.0)::integer else cp.value end;
      if cp.max_discount is not null then disc := least(disc, cp.max_discount); end if;
      disc := greatest(0, least(disc, sub));
    end if;
  end if;

  oid := 'KK' || upper(to_hex((extract(epoch from clock_timestamp()) * 1000)::bigint));
  insert into public.orders (id, user_id, items, subtotal, discount, coupon, shipping, ship_label, total, payment, customer)
  values (oid, auth.uid(), lines, sub, disc, nullif(p_coupon, ''), ship, p_ship_label, sub - disc + ship, p_payment, p_customer);

  return oid;
end;
$$;

revoke all on function public.place_order(jsonb, text, text, text, jsonb) from public;
grant execute on function public.place_order(jsonb, text, text, text, jsonb) to anon, authenticated;
