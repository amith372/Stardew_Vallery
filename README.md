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

## Building an installable APK

Built entirely on this machine — no cloud build service, no third-party site:

```
npx expo run:android --variant release
```

First run downloads Gradle/AndroidX dependencies and generates a native `android/` folder (gitignored — regenerated from `app.json`, not committed). The app installs and launches automatically on a connected device/emulator. The `.apk` itself lands at `android/app/build/outputs/apk/release/app-release.apk` for copying to another phone directly.
