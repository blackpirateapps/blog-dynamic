# Signal Desk

News blog with an editorial dashboard (admin + editor roles) backed by TursoDB and deployable to Vercel.

## Stack
- Next.js (App Router)
- Turso (libSQL)
- Cookie + JWT session auth

## Local setup
1) Install dependencies:
   - `npm install`
2) Create `.env.local` using `.env.example`.
3) Run migrations:
   - `npm run db:migrate`
4) Seed the first admin:
   - `npm run db:seed`
5) Start dev server:
   - `npm run dev`

## Deploy to Vercel
1) Add the same environment variables from `.env.example` in Vercel.
2) Run `npm run db:migrate` once against your production Turso database.

## Notes
- Admins can create and delete users from the dashboard.
- Editors can manage posts but cannot access user management.
