create extension if not exists pgcrypto;

create table if not exists public.novels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null,
  summary text not null,
  cover_path text not null,
  reading_minutes integer not null default 5 check (reading_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scenes (
  id bigserial primary key,
  novel_id uuid not null references public.novels(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (novel_id, position)
);

create index if not exists scenes_novel_position_idx
  on public.scenes (novel_id, position);

alter table public.novels enable row level security;
alter table public.scenes enable row level security;

drop policy if exists "Public novels are readable" on public.novels;
create policy "Public novels are readable"
  on public.novels
  for select
  using (true);

drop policy if exists "Public scenes are readable" on public.scenes;
create policy "Public scenes are readable"
  on public.scenes
  for select
  using (true);
