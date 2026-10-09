-- Run this entire file once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste this -> Run).

create table if not exists profile (
  id int primary key default 1,
  name text,
  tagline text,
  email text,
  phone text,
  location text,
  linkedin text,
  github text,
  summary text,
  resume_url text,
  photo_url text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order int default 0
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text,
  tag text,
  role text,
  dates text,
  tech jsonb default '[]',
  hook text,
  summary text,
  bullets jsonb default '[]',
  prd_link text,
  github_link text,
  sort_order int default 0
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  text text,
  date text,
  sort_order int default 0
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  text text,
  org text,
  date text,
  status text default 'in-progress',
  sort_order int default 0
);

create table if not exists research_paper (
  id int primary key default 1,
  title text,
  publication text,
  date text,
  pdf_link text,
  note text,
  constraint single_row check (id = 1)
);

create table if not exists teardown (
  id int primary key default 1,
  title text,
  product_name text,
  summary text,
  placeholder boolean default true,
  constraint single_row check (id = 1)
);

-- Row Level Security: anyone can read (so the public site works),
-- only a logged-in user can write (so only you can edit).

alter table profile enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table achievements enable row level security;
alter table certifications enable row level security;
alter table research_paper enable row level security;
alter table teardown enable row level security;

create policy "public read profile" on profile for select using (true);
create policy "auth write profile" on profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read skills" on skills for select using (true);
create policy "auth write skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read projects" on projects for select using (true);
create policy "auth write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read achievements" on achievements for select using (true);
create policy "auth write achievements" on achievements for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read certifications" on certifications for select using (true);
create policy "auth write certifications" on certifications for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read research_paper" on research_paper for select using (true);
create policy "auth write research_paper" on research_paper for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read teardown" on teardown for select using (true);
create policy "auth write teardown" on teardown for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for your photo, resume, and PDFs.
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "public read assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "auth upload assets" on storage.objects for insert with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
create policy "auth update assets" on storage.objects for update using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
create policy "auth delete assets" on storage.objects for delete using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
