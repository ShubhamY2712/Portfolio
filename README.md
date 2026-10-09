# Shubham Yawalkar — Portfolio (with live admin dashboard)

Built with Next.js, Tailwind CSS, Motion, and Supabase (database + auth + file storage).

Anyone with the link sees a read-only public site. Only you, logged in at
`/admin`, can edit content, add/remove items, and upload files — no code
editing needed after initial setup.

## One-time setup

1. Create a free project at supabase.com.
2. In your Supabase project's SQL Editor, run `supabase/schema.sql`, then
   run `supabase/seed.sql` (in that order) — this creates every table and
   pre-fills it with your real content.
3. In Supabase: Authentication -> Users -> Add user. Create the one account
   you'll use to log in at `/admin`. Nobody else can create an account —
   there's no public sign-up.
4. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL
   and anon key (Settings -> API in your Supabase dashboard).
5. Run `npm install`, then `npm run dev`. Visit `localhost:3000` for the
   public site, `localhost:3000/admin` to log in and edit.

## Database migrations

After the initial setup, run each migration file once, in order, in the
Supabase SQL Editor:

- `supabase/migration-002.sql` adds, without changing anything existing:
  - the optional Figma / Loom / eval-sheet links and a cover image on `projects`,
  - the homepage hero text, typing-line phrases and banner on `profile`,
  - a new `highlights` table for the "What I'm working on" cards, pre-filled once.
  It's safe to run again (for example if you ran an earlier version of the
  file). Run it **before** deploying the code that uses it.

- `supabase/migration-003.sql` (run after 002): removes duplicate skills /
  achievements / certifications, sets the display name to "Shubham Yawalkar",
  groups skills into Product & business vs Technical, and updates the typing
  line and contact line for AI PM + technical roles. Safe to run again.

- `supabase/migration-004.sql` (run after 003): hero line "I shape and build",
  new typing phrases, the new About text (words in [brackets] are highlighted),
  your full skills list in 8 groups, and award-card titles for achievements.
  Safe to run again.

Paste the SQL **text** into the SQL Editor, not the file name.

## Deploying

Push to GitHub, import into Vercel, and add the same two environment
variables from `.env.local` in Vercel's project settings (Settings ->
Environment Variables) before deploying. Optionally add
`NEXT_PUBLIC_SITE_URL` (your live URL) so link previews use absolute URLs;
on Vercel the production URL is detected automatically if you skip it.

The link-preview image (`app/opengraph-image.tsx`) and the favicons
(`app/icon.svg`, `app/apple-icon.tsx`) are generated automatically from
your profile, so there's nothing to upload.

## Editing content going forward

Everything (Summary, the homepage hero and banner, the "What I'm working on"
cards, Skills, Achievements, Certifications, both Projects with their cover
images and Figma / Loom / eval-sheet links, your photo, resume, and PRDs) is
edited at `/admin` on the live site
itself. You should never need to touch code again for a content change.
