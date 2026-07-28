# Stardew_Vallery

A small household app for logging dog walks. See [CLAUDE.md](./CLAUDE.md) for the full spec.

## Setup

```
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Run [supabase/schema.sql](./supabase/schema.sql) once in the Supabase SQL editor to create the `users` and `walks` tables.
