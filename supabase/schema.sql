-- ═══════════════════════════════════════════════════════════
--  AgriSense AI — Supabase Schema
--  Run this entire file in: Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- 1. Analyses table (soil + weather + crop recommendations)
create table if not exists public.analyses (
  id          uuid    default gen_random_uuid() primary key,
  user_id     uuid    references auth.users(id) on delete cascade not null,
  location    text,
  soil_type   text,
  npk         jsonb,
  weather     jsonb,
  crops       jsonb,
  fertilizer  jsonb,
  irrigation  jsonb,
  xai         jsonb,
  created_at  timestamptz default now()
);

-- 2. Disease scans table (leaf image analysis)
create table if not exists public.disease_scans (
  id           uuid    default gen_random_uuid() primary key,
  user_id      uuid    references auth.users(id) on delete cascade not null,
  disease_name text,
  confidence   float,
  severity     text,
  treatment    jsonb,
  explanation  text,
  created_at   timestamptz default now()
);

-- ── Row Level Security (users only see their own data) ──────────────────────

alter table public.analyses        enable row level security;
alter table public.disease_scans   enable row level security;

create policy "analyses: own rows only" on public.analyses
  for all using (auth.uid() = user_id);

create policy "disease_scans: own rows only" on public.disease_scans
  for all using (auth.uid() = user_id);
