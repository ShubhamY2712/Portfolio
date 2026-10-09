-- migration-002.sql
-- Run in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Run it BEFORE deploying the code that ships with it.
--
-- Safe to run more than once (also safe if you already ran an earlier
-- version of this file): it only ADDS columns / tables if they don't exist,
-- only creates policies that don't exist, and only seeds the new
-- `highlights` table while it is empty. Nothing existing is altered or dropped.

-- 1. Case-study embed slots on projects (InvAI, CreditSaathi, ...)
alter table projects add column if not exists figma_url text;
alter table projects add column if not exists loom_url text;
alter table projects add column if not exists eval_sheet_url text;

-- 2. Project cover image (shown large in "Featured projects") + its alt text
alter table projects add column if not exists cover_url text;
alter table projects add column if not exists cover_alt text;

-- 3. Hero + homepage text, editable in /admin
alter table profile add column if not exists hero_intro text;         -- small line above the headline
alter table profile add column if not exists hero_headline text;      -- big headline
alter table profile add column if not exists hero_highlight text;     -- highlighted words (accent + underline)
alter table profile add column if not exists typing_phrases jsonb default '[]';  -- "I'm ..." typing line
alter table profile add column if not exists currently_text text;     -- e.g. "Currently building InvAI"
alter table profile add column if not exists currently_url text;      -- where that line links
alter table profile add column if not exists statement text;          -- big banner line mid-page

-- Fill the new profile fields once (only where still empty).
update profile set
  hero_intro     = coalesce(hero_intro, 'I design and build'),
  hero_headline  = coalesce(hero_headline, 'AI products,'),
  hero_highlight = coalesce(hero_highlight, 'end to end.'),
  typing_phrases = case
    when typing_phrases is null or typing_phrases = '[]'::jsonb
    then '["an aspiring AI Product Manager", "building InvAI", "leading the CreditSaathi team"]'::jsonb
    else typing_phrases end,
  currently_text = coalesce(currently_text, 'Currently building InvAI'),
  currently_url  = coalesce(currently_url, '/invai'),
  statement      = coalesce(statement, 'I''m currently looking for AI Product Manager and Business Analyst internships and roles.')
where id = 1;

-- 4. "What I'm working on" cards on the homepage
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,          -- role + dates, e.g. "Solo Founder & Product Lead · April 2026 – Present"
  description text,
  link text,              -- optional: "/invai", "/#research", or a full URL
  icon text default 'spark',  -- one of: rocket, chart, book, users, award, spark
  sort_order int default 0
);

alter table highlights enable row level security;

insert into highlights (title, subtitle, description, link, icon, sort_order)
select * from (values
  ('InvAI', 'Solo Founder & Product Lead · April 2026 – Present',
   'An 11-feature multi-tenant SaaS platform across 3 subscription tiers, built solo end to end.',
   '/invai', 'rocket', 1),
  ('CreditSaathi', 'Team Lead (4-member team) · August 2026 – Present',
   'An alternative credit-scoring platform for gig-economy and MSME borrowers, using cross-segment transfer learning and a built-in fairness audit.',
   '/creditsaathi', 'chart', 2),
  ('Research paper', 'Co-author · September 2025',
   '"The Impact of AI in the Indian Economy," published in Progress in Economics Research, Nova Publications.',
   '/#research', 'book', 3),
  ('National Service Scheme (NSS)', 'Outreach Coordinator · 2025 – 2026',
   'Leading 200 volunteers at Ajeenkya DY Patil University; recipient of the Innovation and Creativity Award.',
   null, 'users', 4)
) as seed(title, subtitle, description, link, icon, sort_order)
where not exists (select 1 from highlights);

-- 5. Row Level Security policies: public read, authenticated write.
-- The new columns on `projects` and `profile` inherit those tables' existing
-- policies from schema.sql. The block below only creates policies that are
-- missing; it never replaces existing ones.
alter table projects enable row level security;
alter table profile enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'public read projects') then
    create policy "public read projects" on projects for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'auth write projects') then
    create policy "auth write projects" on projects for all
      using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profile' and policyname = 'public read profile') then
    create policy "public read profile" on profile for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profile' and policyname = 'auth write profile') then
    create policy "auth write profile" on profile for all
      using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'highlights' and policyname = 'public read highlights') then
    create policy "public read highlights" on highlights for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'highlights' and policyname = 'auth write highlights') then
    create policy "auth write highlights" on highlights for all
      using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end
$$;
