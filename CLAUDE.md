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
A "walk" has: user (nickname), date, time, pooped (yes/no), peed (yes/no), optional note.
A "user" is just a nickname saved on first launch. No auth, no passwords.

## Screens
1. First launch: ask for nickname, save it.
2. Home: today's walks (shown first on open). A status banner shows how
   overdue the dog's next walk is, based on time since the last logged walk.
3. Add walk: pick time, toggle pooped / peed, optional note, save.
4. History: browse past days. Anyone can view all days; the person who
   originally logged a walk can edit that entry's pooped/peed toggles and
   note anytime (on Home for today's walks, and in History for past days),
   and delete that entry entirely (with a confirmation prompt).

## Stack
- Front end: React Native (Expo), UI in Hebrew with RTL layout
- Data storage: supabase

## Don't
- Don't add login, accounts, or passwords.
- Don't add analytics or external tracking.
- Don't refactor unrelated files in the same change.
- Don't add comments that just restate the code.