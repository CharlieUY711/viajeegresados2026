-- ─────────────────────────────────────────────────────────────────────────────
-- GradTrip — Supabase Schema
-- Run this in your Supabase SQL Editor to set up all tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Users (extends Supabase auth.users) ─────────────────────────────────────
create table public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text not null,
  avatar_url  text,
  role        text not null default 'member' check (role in ('admin', 'member')),
  created_at  timestamptz not null default now()
);
alter table public.users enable row level security;
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Events ──────────────────────────────────────────────────────────────────
create table public.events (
  id                   uuid primary key default uuid_generate_v4(),
  title                text not null,
  description          text not null default '',
  date                 timestamptz not null,
  end_date             timestamptz,
  location             text,
  category             text not null check (category in ('fundraising', 'social', 'meeting', 'trip')),
  status               text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  max_participants     int,
  current_participants int default 0,
  created_by           uuid references public.users(id) not null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "All authenticated users can view events" on public.events for select using (auth.role() = 'authenticated');
create policy "Admins can insert events" on public.events for insert with check (auth.role() = 'authenticated');
create policy "Admins can update events" on public.events for update using (auth.role() = 'authenticated');

-- ─── Event Participants ───────────────────────────────────────────────────────
create table public.event_participants (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid references public.events(id) on delete cascade not null,
  user_id    uuid references public.users(id) on delete cascade not null,
  joined_at  timestamptz not null default now(),
  unique (event_id, user_id)
);
alter table public.event_participants enable row level security;
create policy "View participants" on public.event_participants for select using (auth.role() = 'authenticated');
create policy "Join events" on public.event_participants for insert with check (auth.uid() = user_id);
create policy "Leave events" on public.event_participants for delete using (auth.uid() = user_id);

-- ─── Transactions ─────────────────────────────────────────────────────────────
create table public.transactions (
  id             uuid primary key default uuid_generate_v4(),
  event_id       uuid references public.events(id) on delete set null,
  type           text not null check (type in ('income', 'expense')),
  amount         numeric(10,2) not null check (amount > 0),
  description    text not null,
  responsible_id uuid references public.users(id) not null,
  date           date not null,
  created_at     timestamptz not null default now()
);
alter table public.transactions enable row level security;
create policy "View transactions" on public.transactions for select using (auth.role() = 'authenticated');
create policy "Insert transactions" on public.transactions for insert with check (auth.role() = 'authenticated');
create policy "Delete own transactions" on public.transactions for delete using (auth.uid() = responsible_id);

-- ─── Commissions ─────────────────────────────────────────────────────────────
create table public.commissions (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text not null default '',
  color       text not null default 'blue',
  icon        text not null default '📋',
  created_at  timestamptz not null default now()
);
alter table public.commissions enable row level security;
create policy "View commissions" on public.commissions for select using (auth.role() = 'authenticated');

create table public.commission_members (
  id            uuid primary key default uuid_generate_v4(),
  commission_id uuid references public.commissions(id) on delete cascade not null,
  user_id       uuid references public.users(id) on delete cascade not null,
  role          text not null default 'member' check (role in ('lead', 'member')),
  joined_at     timestamptz not null default now(),
  unique (commission_id, user_id)
);
alter table public.commission_members enable row level security;
create policy "View commission members" on public.commission_members for select using (auth.role() = 'authenticated');

create table public.commission_tasks (
  id            uuid primary key default uuid_generate_v4(),
  commission_id uuid references public.commissions(id) on delete cascade not null,
  title         text not null,
  status        text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  assigned_to   uuid references public.users(id) on delete set null,
  due_date      date,
  created_at    timestamptz not null default now()
);
alter table public.commission_tasks enable row level security;
create policy "View tasks" on public.commission_tasks for select using (auth.role() = 'authenticated');
create policy "Manage tasks" on public.commission_tasks for all using (auth.role() = 'authenticated');

-- ─── Gallery ─────────────────────────────────────────────────────────────────
create table public.gallery_items (
  id            uuid primary key default uuid_generate_v4(),
  storage_path  text not null,
  public_url    text not null,
  thumbnail_url text,
  type          text not null default 'image' check (type in ('image', 'video')),
  title         text,
  description   text,
  event_id      uuid references public.events(id) on delete set null,
  uploaded_by   uuid references public.users(id) not null,
  uploaded_at   timestamptz not null default now()
);
alter table public.gallery_items enable row level security;
create policy "View gallery" on public.gallery_items for select using (auth.role() = 'authenticated');
create policy "Upload photos" on public.gallery_items for insert with check (auth.uid() = uploaded_by);
create policy "Delete own photos" on public.gallery_items for delete using (auth.uid() = uploaded_by);

-- ─── Documents ───────────────────────────────────────────────────────────────
create table public.documents (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  description  text,
  storage_path text not null,
  public_url   text not null,
  file_size    bigint not null,
  file_type    text not null,
  category     text not null default 'other' check (category in ('contract', 'report', 'budget', 'consent', 'other')),
  event_id     uuid references public.events(id) on delete set null,
  uploaded_by  uuid references public.users(id) not null,
  uploaded_at  timestamptz not null default now()
);
alter table public.documents enable row level security;
create policy "View documents" on public.documents for select using (auth.role() = 'authenticated');
create policy "Upload documents" on public.documents for insert with check (auth.uid() = uploaded_by);
create policy "Delete own documents" on public.documents for delete using (auth.uid() = uploaded_by);

-- ─── Pools (Games) ───────────────────────────────────────────────────────────
create table public.pools (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  description       text not null default '',
  type              text not null check (type in ('prediction', 'raffle', 'challenge')),
  entry_fee         numeric(10,2) not null default 0,
  prize_description text not null default '',
  deadline          timestamptz not null,
  status            text not null default 'open' check (status in ('open', 'closed', 'finished')),
  created_by        uuid references public.users(id) not null,
  created_at        timestamptz not null default now()
);
alter table public.pools enable row level security;
create policy "View pools" on public.pools for select using (auth.role() = 'authenticated');
create policy "Create pools" on public.pools for insert with check (auth.role() = 'authenticated');

create table public.pool_participants (
  id          uuid primary key default uuid_generate_v4(),
  pool_id     uuid references public.pools(id) on delete cascade not null,
  user_id     uuid references public.users(id) on delete cascade not null,
  prediction  text,
  score       int default 0,
  joined_at   timestamptz not null default now(),
  unique (pool_id, user_id)
);
alter table public.pool_participants enable row level security;
create policy "View pool participants" on public.pool_participants for select using (auth.role() = 'authenticated');
create policy "Join pools" on public.pool_participants for insert with check (auth.uid() = user_id);

-- ─── Leaderboard View ────────────────────────────────────────────────────────
create or replace view public.leaderboard as
select
  u.id as user_id,
  u.full_name,
  u.avatar_url,
  coalesce(sum(pp.score), 0) +
    (select count(*) * 10 from public.event_participants ep where ep.user_id = u.id) as total_points,
  (select count(*) from public.event_participants ep where ep.user_id = u.id) as events_participated,
  (select count(*) from public.pool_participants pp2 where pp2.user_id = u.id and pp2.score > 0) as pools_won
from public.users u
left join public.pool_participants pp on pp.user_id = u.id
group by u.id, u.full_name, u.avatar_url
order by total_points desc;

-- ─── Storage Buckets ─────────────────────────────────────────────────────────
-- Run these in Supabase Dashboard > Storage, or via the API:
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
