-- migration-003.sql
-- Paste the CONTENTS of this file into Supabase -> SQL Editor -> New query -> Run.
-- (Paste the SQL text itself, not the file name.)
-- Run AFTER migration-002.sql. Safe to run more than once.
--
-- What it does:
--   1. Removes exact duplicate rows in skills, achievements and certifications
--      (they were inserted twice when seed.sql ran twice). One copy of each is kept.
--   2. Sets your display name to "Shubham Yawalkar".
--   3. Adds a `category` column to skills ("product" or "technical") so the
--      site can show Product & business skills and Technical skills separately,
--      and adds the technical tools already listed in your project stacks.
--   4. Updates the hero typing line and contact line to cover both AI PM and
--      technical roles, but only if you haven't edited them yourself.
-- No tables or columns are dropped.

-- 1. Remove duplicates (keeps the first copy of each)
delete from skills a
  using skills b
  where a.label = b.label and a.ctid > b.ctid;

delete from achievements a
  using achievements b
  where a.text is not distinct from b.text
    and a.date is not distinct from b.date
    and a.ctid > b.ctid;

delete from certifications a
  using certifications b
  where a.text is not distinct from b.text
    and a.org is not distinct from b.org
    and a.ctid > b.ctid;

-- 2. Display name
update profile set name = 'Shubham Yawalkar'
  where id = 1 and name = 'Shubham Nitin Yawalkar';

-- 3. Skill categories
alter table skills add column if not exists category text default 'technical';

update skills set category = 'product'
  where label in ('Product Management', 'Product Strategy', 'Agile Methodology (Scrum)', 'Figma',
                  'Stakeholder Management', 'Team Management');

update skills set category = 'technical'
  where category is null
     or label in ('Python', 'SQL', 'Machine Learning', 'RAG', 'Prompt Engineering', 'Vibe Coding',
                  'APIs', 'Data Analytics');

-- Technical tools from your InvAI / CreditSaathi stacks (added only if missing)
insert into skills (label, sort_order, category)
select v.label, v.sort_order, 'technical'
from (values
  ('FastAPI', 20), ('PostgreSQL', 21), ('Next.js', 22), ('LangChain', 23),
  ('pgvector', 24), ('Claude API', 25), ('Transfer Learning', 26)
) as v(label, sort_order)
where not exists (select 1 from skills s where s.label = v.label);

-- 4. Hero typing line + contact line for both AI PM and technical roles
update profile set typing_phrases =
  '["an aspiring AI Product Manager", "a hands-on AI/ML builder", "building InvAI end to end", "leading the CreditSaathi team"]'::jsonb
  where id = 1
    and typing_phrases = '["an aspiring AI Product Manager", "building InvAI", "leading the CreditSaathi team"]'::jsonb;

update profile set statement =
  'Open to AI Product Manager, Business Analyst and technical AI/ML internships and roles.'
  where id = 1
    and (statement is null
         or statement = 'I''m currently looking for AI Product Manager and Business Analyst internships and roles.');
