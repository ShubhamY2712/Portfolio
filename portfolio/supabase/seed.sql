-- Run this AFTER schema.sql, once, to pre-fill your database with
-- everything already built in this conversation. Same place: SQL Editor -> New query -> Run.

insert into profile (id, name, tagline, email, phone, location, linkedin, github, summary, resume_url, photo_url)
values (
  1,
  'Shubham Nitin Yawalkar',
  'Aspiring AI Product Manager, building AI-driven products end to end',
  'shubham.yawalkar@adypu.edu.in',
  '+91 8097102827',
  'Pune, India',
  'https://linkedin.com/in/shubham-yawalkar',
  'https://github.com/ShubhamY2712',
  'Final-year AI & Data Science student and aspiring AI Product Manager, building two AI-driven products end to end. Founding and building InvAI, a multi-tenant SaaS platform for supply-chain intelligence with a RAG-based AI assistant — caught a margin shortfall in the premium AI-tier pricing and redesigned the monetization strategy to fix it. Leading a team building CreditSaathi, a credit-scoring platform for gig-economy and MSME borrowers, using cross-segment transfer learning to address data scarcity and a built-in fairness audit to reduce bias. Co-authored a published research paper on AI''s impact on the Indian economy.',
  null,
  null
)
on conflict (id) do update set
  name = excluded.name, tagline = excluded.tagline, email = excluded.email,
  phone = excluded.phone, location = excluded.location, linkedin = excluded.linkedin,
  github = excluded.github, summary = excluded.summary;

insert into skills (label, sort_order) values
  ('Python', 1), ('SQL', 2), ('Machine Learning', 3), ('RAG', 4),
  ('Prompt Engineering', 5), ('Vibe Coding', 6), ('APIs', 7),
  ('Product Management', 8), ('Product Strategy', 9), ('Agile Methodology (Scrum)', 10),
  ('Figma', 11), ('Data Analytics', 12), ('Stakeholder Management', 13), ('Team Management', 14);

insert into projects (slug, name, tag, role, dates, tech, hook, summary, bullets, prd_link, github_link, sort_order)
values (
  'invai',
  'InvAI',
  'AI-Powered Supply Chain Intelligence Platform (SaaS)',
  'Solo Founder & Product Lead',
  'April 2026 – Present',
  '["Python", "FastAPI", "PostgreSQL", "Next.js", "Claude API", "pgvector", "LangChain"]',
  'Caught a pricing margin shortfall before launch and redesigned the monetization strategy to fix it.',
  'An 11-feature multi-tenant SaaS platform across 3 subscription tiers, built solo end to end — from architecture decisions to a self-directed security review.',
  '["Founding and building InvAI, an 11-feature multi-tenant SaaS platform across 3 subscription tiers — caught a margin shortfall in the premium AI-tier pricing before launch and redesigned the monetization strategy to fix it.", "Made the core architecture decisions, prioritizing secure multi-tenant data isolation and a full purchase-order/inventory workflow to support franchise-scale customers, and sequenced a RAG-based AI assistant as phase 2 of a 4-phase product roadmap.", "Ran a self-directed security review and remediated 6 critical vulnerabilities before any external exposure; authored an AI Product Requirements Document for the platform."]',
  null,
  'https://github.com/ShubhamY2712',
  1
),
(
  'creditsaathi',
  'CreditSaathi',
  'AI-Driven Alternative Credit Scoring Platform',
  'Team Lead (4-member team)',
  'August 2026 – Present',
  '["Python", "Machine Learning", "Transfer Learning"]',
  'Merged two underserved FinTech niches into one unified credit-scoring product.',
  'An alternative credit-scoring platform for gig-economy and MSME borrowers, using cross-segment transfer learning and a built-in fairness audit.',
  '["Originated the idea and lead a team building CreditSaathi, an alternative credit-scoring platform for gig-economy and MSME borrowers underserved by traditional models, from ideation through formal panel evaluation.", "Identified an underserved market opportunity by merging two adjacent FinTech niches, gig-economy credit scoring and MSME alternative-data creditworthiness, into a single unified product concept.", "Selected cross-segment transfer learning to address data scarcity across these segments; currently developing a peer-relative, cluster-normalized scoring model with a built-in fairness audit and borrower-facing transparency features."]',
  null,
  'https://github.com/ShubhamY2712',
  2
)
on conflict (slug) do nothing;

insert into achievements (text, date, sort_order) values
  ('Outreach Coordinator, National Service Scheme (NSS), Ajeenkya DY Patil University, leading 200 volunteers; recipient of the Innovation and Creativity Award', '2025 – 2026', 1),
  ('Co-authored a published research paper, "The Impact of AI in the Indian Economy," in Progress in Economics Research, Nova Publications', 'September 2025', 2),
  ('Winner, Best Social Impact Award, HackVerse Hackathon, for an interactive web platform teaching underage children about their legal rights through games, quizzes, and educational videos', '2025', 3),
  ('President, Literature Club, Ajeenkya DY Patil University', '2023 – 2025', 4);

insert into certifications (text, org, date, status, sort_order) values
  ('Business Intelligence', 'Google Career Certificates', 'November 2024', 'done', 1),
  ('Generative AI for Everyone', 'DeepLearning.AI', 'Expected September 2026', 'in-progress', 2),
  ('Master Product Management by Actually Building a Product', 'Udemy', 'Expected October 2026', 'in-progress', 3),
  ('Complete UI/UX Design Course: Figma + AI + Real Project', 'Udemy', 'Expected October 2026', 'in-progress', 4);

insert into research_paper (id, title, publication, date, pdf_link, note)
values (1, 'The Impact of AI in the Indian Economy', 'Progress in Economics Research, Nova Publications', 'September 2025', null, 'Co-authored — not sole author.')
on conflict (id) do update set title = excluded.title, publication = excluded.publication, date = excluded.date, note = excluded.note;

insert into teardown (id, title, product_name, summary, placeholder)
values (1, 'Product Teardown', 'TODO: pick an AI product to tear down', 'TODO: write your teardown here — what works, what doesn''t, and what you''d change if you were the PM.', true)
on conflict (id) do nothing;
