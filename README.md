# Stardew_Vallery

A small household app for logging dog walks. See [CLAUDE.md](./CLAUDE.md) for the full spec.

## Setup

```
npm install
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start
```

Scan the QR code with the Expo Go app on your phone to run it, or press `w` to open it in a browser.

Run [supabase/schema.sql](./supabase/schema.sql) once in the Supabase SQL editor to create the `users` and `walks` tables.
