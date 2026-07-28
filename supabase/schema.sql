-- Run this once in the Supabase SQL editor to set up the app's tables.

create table users (
  id uuid primary key default gen_random_uuid(),
  nickname text unique not null,
  created_at timestamptz not null default now()
);

create table walks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id),
  walk_date date not null,
  walk_time time not null,
  pooped boolean not null default false,
  peed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Household app, no auth to key policies off of — allow open read/write.
alter table users enable row level security;
alter table walks enable row level security;

create policy "anyone can read users" on users for select using (true);
create policy "anyone can add users" on users for insert with check (true);

create policy "anyone can read walks" on walks for select using (true);
create policy "anyone can add walks" on walks for insert with check (true);
create policy "anyone can update walks" on walks for update using (true);

-- RLS policies only take effect once the role also has base table privileges.
grant select, insert, update on users to anon, authenticated;
grant select, insert, update on walks to anon, authenticated;
