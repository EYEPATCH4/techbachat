-- TechBachat V2 database
create extension if not exists pgcrypto;

create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false
);

create table if not exists public.products(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  image_url text default '',
  category text default 'Tech',
  retailer text default '',
  current_price numeric not null default 0,
  previous_price numeric,
  discount_percentage numeric,
  rating numeric,
  description text default '',
  specifications jsonb not null default '[]'::jsonb,
  affiliate_url text not null default '',
  is_price_drop boolean not null default false,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.articles(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text default '',
  featured_image_url text default '',
  category text default 'Tech',
  content text not null default '',
  author text default 'TechBachat Editorial',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.categories(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.site_settings(
  id integer primary key default 1,
  site_name text default 'TechBachat',
  tagline text default 'SMART TECH. BETTER PRICES.',
  hero_title text default 'Don''t overpay for tech.',
  hero_subtitle text default '',
  hero_cta text default 'Explore Deals',
  whatsapp_url text default '',
  instagram_url text default '',
  telegram_url text default '',
  youtube_url text default '',
  contact_email text default '',
  footer_text text default '',
  show_hero boolean default true,
  show_featured boolean default true,
  show_articles boolean default true,
  show_price_drops boolean default true,
  show_guides boolean default true,
  show_whatsapp boolean default true
);

insert into public.site_settings(id) values(1) on conflict(id) do nothing;

insert into public.categories(name,slug,sort_order) values
('Smartphones','smartphones',1),('Laptops','laptops',2),('Gaming','gaming',3),
('PC Components','pc-components',4),('Audio','audio',5),('Monitors','monitors',6)
on conflict(slug) do nothing;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.articles enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;

-- Public visitors can read published content/settings.
create policy "public read published products" on public.products for select using (is_published = true);
create policy "public read published articles" on public.articles for select using (is_published = true);
create policy "public read visible categories" on public.categories for select using (is_visible = true);
create policy "public read settings" on public.site_settings for select using (true);

-- Admin check: only a profile marked is_admin can manage CMS data.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and is_admin=true); $$;

create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage articles" on public.articles for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read profiles" on public.profiles for select using (id=auth.uid() or public.is_admin());

-- Storage bucket. Run this once; if it already exists, the insert is harmless.
insert into storage.buckets(id,name,public) values('site-media','site-media',true)
on conflict(id) do update set public=true;

create policy "public media read" on storage.objects for select using (bucket_id='site-media');
create policy "admins upload media" on storage.objects for insert with check (bucket_id='site-media' and public.is_admin());
create policy "admins update media" on storage.objects for update using (bucket_id='site-media' and public.is_admin());
create policy "admins delete media" on storage.objects for delete using (bucket_id='site-media' and public.is_admin());

-- After creating the admin user in Authentication, replace these values:
-- insert into public.profiles(id,email,is_admin) values('USER-UUID','YOUR-EMAIL',true);
