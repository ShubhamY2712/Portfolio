# Shubham Yawalkar · Portfolio

**Live site: [shubhamyawalkar.vercel.app](https://shubhamyawalkar.vercel.app)**

My personal portfolio as an aspiring AI Product Manager and full stack developer. It covers my projects (InvAI and CreditSaathi), skills, published research and recognition. All content is edited from a private admin dashboard, with no code changes.

## Features

- Dark amber design, responsive from 360px, with a mobile menu
- Animations that respect the visitor's "reduce motion" setting
- Case study pages for InvAI and CreditSaathi, with optional Figma, Loom and evaluation-sheet embeds
- `/admin` dashboard (single editor account) to edit text, projects, skills, achievements, certifications, research details and images
- Open Graph image and favicons generated automatically
- Daily Vercel cron (`/api/keep-alive`) so the free Supabase project doesn't pause

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Motion · Supabase (database, auth, storage) · Vercel

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev                        # http://localhost:3000  (admin: /admin)
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Optional, e.g. `https://shubhamyawalkar.vercel.app` |

## Database setup

In the Supabase SQL Editor, paste and run the contents of these files once, in this order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/migration-002.sql` → `003` → `004` → `005`

The migration files only add columns or tables and are safe to run again. Then create the single admin user in **Authentication → Users → Add user**. There is no public sign-up.

## Deploy

Import the repo into Vercel, add the environment variables above, and deploy. The keep-alive cron is configured in `vercel.json`.
