# GlobalWorks (Green Theme) — Next.js + Supabase Starter

A clean, modern green-themed website inspired by global recruitment / jobs abroad sites.

## Features
- Next.js (App Router) + Tailwind
- Supabase Auth (email/password)
- Public pages: Home, Jobs, Visas, Destinations, How it works, About, Contact
- Member dashboard (protected)
- Admin panel (protected by `profiles.is_admin`)
- Example DB schema + RLS policies

## 1) Setup
### Install
```bash
npm install
```

### Env
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Database
Open Supabase SQL Editor and run:
- `supabase/schema.sql`

Then create an admin:
1. Sign up in the app
2. In Supabase Table Editor → `profiles` → set `is_admin = true` for your user row

## 2) Run
```bash
npm run dev
```
Open http://localhost:3000
