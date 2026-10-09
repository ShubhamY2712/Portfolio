-- migration-004.sql
-- Paste the CONTENTS of this file into Supabase -> SQL Editor -> New query -> Run.
-- Run AFTER migration-003.sql. Safe to run more than once.
--
-- What it does (all approved in chat):
--   1. Hero: "I shape and build" + the 3 typing-line phrases.
--   2. About text (Version A). Words in [square brackets] are highlighted on the site.
--   3. Skills: your full list, arranged into 8 groups. Removes 3 skills that
--      were added earlier by migration-003 but are not in your list
--      (pgvector, Claude API, Transfer Learning).
--   4. Achievements: adds short title / detail / icon columns so each one
--      shows as an award card instead of a paragraph, and fills them for
--      your 4 existing achievements (matched by their current text).
-- No tables or columns are dropped.

-- 1. Hero
update profile set
  hero_intro = 'I shape and build',
  typing_phrases = '["an aspiring AI Product Manager", "a Full Stack Developer", "a co-author of published AI research"]'::jsonb
where id = 1;

-- 2. About text
update profile set summary =
'I''m a final-year [AI & Data Science] student at Ajeenkya DY Patil University who enjoys working on [both sides of a product]: deciding what to build, and building it.

Right now I''m founding [InvAI], a multi-tenant SaaS for supply-chain intelligence, where I caught a margin shortfall in the AI-tier pricing before launch and redesigned the monetization. I also lead a 4-member team building [CreditSaathi], an alternative credit-scoring platform for gig workers and MSMEs, with a [built-in fairness audit].

Beyond code, I [co-authored] a published paper on AI''s impact on the Indian economy and led [200 volunteers] as NSS Outreach Coordinator.'
where id = 1;

-- 3. Skills
alter table skills add column if not exists category text default 'tools';

delete from skills where label in ('pgvector', 'Claude API', 'Transfer Learning');

-- Remove any duplicates first (keeps one copy), then upsert the full list.
delete from skills a using skills b where a.label = b.label and a.ctid > b.ctid;

with wanted(label, category, sort_order) as (values
  ('Product Management', 'product', 1),
  ('Product Strategy', 'product', 2),
  ('Agile Methodology (Scrum)', 'product', 3),
  ('Stakeholder Management', 'product', 4),
  ('Data Analytics', 'product', 5),
  ('Figma', 'product', 6),
  ('Python', 'languages', 10),
  ('JavaScript', 'languages', 11),
  ('TypeScript', 'languages', 12),
  ('SQL', 'languages', 13),
  ('Next.js', 'frontend', 20),
  ('React', 'frontend', 21),
  ('Tailwind CSS', 'frontend', 22),
  ('FastAPI', 'backend', 30),
  ('Node.js', 'backend', 31),
  ('APIs', 'backend', 32),
  ('PostgreSQL', 'database', 40),
  ('Supabase', 'database', 41),
  ('Authentication & Authorization', 'database', 42),
  ('Machine Learning', 'ai', 50),
  ('RAG', 'ai', 51),
  ('LangChain', 'ai', 52),
  ('Prompt Engineering', 'ai', 53),
  ('AWS', 'ai', 54),
  ('Vercel', 'tools', 60),
  ('Git/GitHub', 'tools', 61),
  ('Vibe Coding', 'tools', 62),
  ('Team Management', 'professional', 70),
  ('Effective Communication', 'professional', 71),
  ('Collaboration', 'professional', 72)
),
updated as (
  update skills s set category = w.category, sort_order = w.sort_order
  from wanted w where s.label = w.label
  returning s.label
)
insert into skills (label, category, sort_order)
select w.label, w.category, w.sort_order from wanted w
where not exists (select 1 from skills s where s.label = w.label);

-- 4. Achievements as award cards
alter table achievements add column if not exists title text;
alter table achievements add column if not exists detail text;
alter table achievements add column if not exists icon text default 'award';

update achievements set
  title = 'Best Social Impact Award',
  detail = 'HackVerse Hackathon winner, for an interactive web platform teaching underage children their legal rights through games, quizzes and videos.',
  icon = 'trophy'
where text like 'Winner, Best Social Impact Award, HackVerse%' and title is null;

update achievements set
  title = 'Outreach Coordinator, NSS',
  detail = 'Led 200 volunteers at Ajeenkya DY Patil University; recipient of the Innovation and Creativity Award.',
  icon = 'users'
where text like 'Outreach Coordinator, National Service Scheme%' and title is null;

update achievements set
  title = 'Published research (co-author)',
  detail = '"The Impact of AI in the Indian Economy" in Progress in Economics Research, Nova Publications.',
  icon = 'book'
where text like 'Co-authored a published research paper%' and title is null;

update achievements set
  title = 'President, Literature Club',
  detail = 'Ajeenkya DY Patil University.',
  icon = 'feather'
where text like 'President, Literature Club%' and title is null;

-- Show the award first.
update achievements set sort_order = 1 where icon = 'trophy';
update achievements set sort_order = 2 where icon = 'users';
update achievements set sort_order = 3 where icon = 'book';
update achievements set sort_order = 4 where icon = 'feather';
