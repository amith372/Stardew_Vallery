# Stardew Vallery

## What this is
A small local app for one household to log dog walks. Max 6 users, no public access.
On first launch a user enters a nickname (no password). Anyone can add a walk
(time + whether the dog pooped and/or peed) and view past days. The app opens on
today's walks.

## Working style (important to me)
- Before any DRASTIC change, STOP and describe the plan first, then wait for my "go".
  Drastic = changing how data is stored, changing the data model, adding a dependency,
  deleting/moving files, or anything touching more than one file.
- Use plan mode for multi-file work.
- Prefer small, reversible changes over big rewrites.

## Principles
- Keep it simple. This is a 6-person app, not a product for millions.
- Readable over clever.
- No feature without a quick way to test that it works.
- Ask before adding any new dependency.

## Data model
A "walk" has: user (nickname), date, time, pooped (yes/no), peed (yes/no).
A "user" is just a nickname saved on first launch. No auth, no passwords.

## Screens
1. First launch: ask for nickname, save it.
2. Home: today's walks (shown first on open).
3. Add walk: pick time, toggle pooped / peed, save.
4. History: browse past days (read-only).

## Stack
- Front end: [React + Vite]
- Data storage: supabase

## Don't
- Don't add login, accounts, or passwords.
- Don't add analytics or external tracking.
- Don't refactor unrelated files in the same change.
- Don't add comments that just restate the code.