-- migration-005.sql
-- Paste the CONTENTS of this file into Supabase -> SQL Editor -> New query -> Run.
-- Run AFTER migration-004.sql. Safe to run more than once.
--
-- What it does:
--   1. Research paper: adds publication-detail columns (DOI, ISBN, series,
--      BISAC, volume, cover image) and fills them in.
--   2. Certifications: adds AWS, Scaler Topics and Infosys Springboard
--      (only if they aren't there yet).
--   3. Achievements: adds an "issuer" column, adds the Nukkad Natak first
--      prize and the Innovation and Creativity Award (only if missing),
--      and re-orders the cards.
-- No tables or columns are dropped.

-- 1. Research paper details
alter table research_paper add column if not exists cover_url text;
alter table research_paper add column if not exists doi text;
alter table research_paper add column if not exists isbn text;
alter table research_paper add column if not exists series text;
alter table research_paper add column if not exists series_url text;
alter table research_paper add column if not exists volume text;
alter table research_paper add column if not exists bisac text;

update research_paper set
  date       = 'September 2, 2025',
  doi        = 'https://doi.org/10.52305/LDUZ6822',
  isbn       = '979-8-89530-752-6',
  series     = 'Progress in Economics Research',
  series_url = 'https://novapublishers.com/product-category/series/progress-in-economics-research/',
  volume     = 'Volume 55',
  bisac      = 'BUS000000'
where id = 1;

-- 2. Certifications
insert into certifications (text, org, date, status, sort_order)
select v.text, v.org, v.date, 'done', v.sort_order
from (values
  ('AWS Cloud Practitioner and Technical Essentials', 'AWS Training & Certification', 'September 2026', 10),
  ('DBMS Course: Fundamentals and Advanced Concepts', 'Scaler Topics', 'April 2025', 11),
  ('Database and SQL', 'Infosys Springboard', 'November 2024', 12)
) as v(text, org, date, sort_order)
where not exists (select 1 from certifications c where c.text = v.text);

-- Newest first.
update certifications set sort_order = 1 where text = 'AWS Cloud Practitioner and Technical Essentials';
update certifications set sort_order = 2 where text = 'Generative AI for Everyone';
update certifications set sort_order = 3 where text = 'Master Product Management by Actually Building a Product';
update certifications set sort_order = 4 where text = 'Complete UI/UX Design Course: Figma + AI + Real Project';
update certifications set sort_order = 5 where text = 'DBMS Course: Fundamentals and Advanced Concepts';
update certifications set sort_order = 6 where text = 'Business Intelligence';
update certifications set sort_order = 7 where text = 'Database and SQL';

-- 3. Achievements
alter table achievements add column if not exists issuer text;
alter table achievements add column if not exists title text;
alter table achievements add column if not exists detail text;
alter table achievements add column if not exists icon text default 'award';

insert into achievements (text, title, issuer, detail, icon, date, sort_order)
select v.text, v.title, v.issuer, v.detail, v.icon, null, v.sort_order
from (values
  ('First Prize, Nukkad Natak (Street Play), National Service Scheme (NSS)',
   'First Prize, Nukkad Natak (Street Play)',
   'National Service Scheme (NSS)',
   'Led a team to win first prize in the Nukkad Natak competition during an intensive 7-day NSS camp, with a performance on the discrimination faced by North East Indian citizens.',
   'award', 2),
  ('Innovation and Creativity Award, ADYPU NSS Unit',
   'Innovation and Creativity Award',
   'ADYPU NSS Unit',
   'Honored for introducing novel approaches to community engagement and event organization, and for conceptualizing and executing unique, high-impact initiatives during intensive campus and community programs.',
   'star', 3)
) as v(text, title, issuer, detail, icon, sort_order)
where not exists (select 1 from achievements a where a.title = v.title);

-- The Innovation and Creativity Award now has its own card, so the NSS card
-- only mentions the volunteers (updated only if it still has the old text).
update achievements set
  detail = 'Led 200 volunteers at Ajeenkya DY Patil University.',
  issuer = 'National Service Scheme (NSS)'
where title = 'Outreach Coordinator, NSS'
  and detail = 'Led 200 volunteers at Ajeenkya DY Patil University; recipient of the Innovation and Creativity Award.';

update achievements set issuer = 'HackVerse Hackathon' where title = 'Best Social Impact Award' and issuer is null;
update achievements set issuer = 'Nova Publications' where title = 'Published research (co-author)' and issuer is null;

-- Order: award first, then the two NSS awards, then roles and research.
update achievements set sort_order = 1 where title = 'Best Social Impact Award';
update achievements set sort_order = 2 where title = 'First Prize, Nukkad Natak (Street Play)';
update achievements set sort_order = 3 where title = 'Innovation and Creativity Award';
update achievements set sort_order = 4 where title = 'Outreach Coordinator, NSS';
update achievements set sort_order = 5 where title = 'Published research (co-author)';
update achievements set sort_order = 6 where title = 'President, Literature Club';
