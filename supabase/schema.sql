-- GlobalWorks schema (starter) — run in Supabase SQL editor

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  country text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.job_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id uuid references public.job_categories(id),
  country text,
  salary_range text,
  requirements text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  highlights text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.visa_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  full_name text not null,
  email text not null,
  phone text,
  visa_type text not null,
  destination text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  cv_url text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.job_categories enable row level security;
alter table public.jobs enable row level security;
alter table public.destinations enable row level security;
alter table public.visa_inquiries enable row level security;
alter table public.job_applications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "job_categories_public_read" on public.job_categories
for select using (true);

create policy "jobs_public_read" on public.jobs
for select using (true);

create policy "destinations_public_read" on public.destinations
for select using (true);

create policy "job_categories_admin_write" on public.job_categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "jobs_admin_write" on public.jobs
for all using (public.is_admin()) with check (public.is_admin());

create policy "destinations_admin_write" on public.destinations
for all using (public.is_admin()) with check (public.is_admin());

create policy "visa_inquiries_insert_anyone" on public.visa_inquiries
for insert with check (true);

create policy "visa_inquiries_select_own" on public.visa_inquiries
for select using (auth.uid() = user_id);

create policy "visa_inquiries_admin_all" on public.visa_inquiries
for select using (public.is_admin());

create policy "visa_inquiries_admin_update" on public.visa_inquiries
for update using (public.is_admin()) with check (public.is_admin());

create policy "job_applications_insert_own" on public.job_applications
for insert with check (auth.uid() = user_id);

create policy "job_applications_select_own" on public.job_applications
for select using (auth.uid() = user_id);

create policy "job_applications_admin_all" on public.job_applications
for select using (public.is_admin());

create policy "job_applications_admin_update" on public.job_applications
for update using (public.is_admin()) with check (public.is_admin());

insert into public.job_categories (name, slug, icon)
values
  ('Healthcare', 'healthcare', 'stethoscope'),
  ('Construction', 'construction', 'hard-hat'),
  ('Hospitality', 'hospitality', 'utensils'),
  ('Logistics', 'logistics', 'truck')
on conflict (slug) do nothing;

insert into public.destinations (name, slug, highlights, image_url)
values
  ('United Kingdom', 'uk', 'NHS roles, construction, hospitality', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'),
  ('Canada', 'canada', 'Skilled workers, care-giving pathways', 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80'),
  ('UAE', 'uae', 'Fast hiring cycles, logistics & hospitality', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80')
on conflict (slug) do nothing;
