-- ============================================================
-- IslaJobs — Supabase SQL Schema
-- Run in the Supabase SQL editor or via `supabase db push`
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enum Types ───────────────────────────────────────────────
create type public.user_role as enum ('customer', 'worker', 'both');
create type public.verification_status as enum ('not_submitted', 'pending', 'approved', 'rejected');
create type public.job_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type public.booking_status as enum ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
create type public.pricing_type as enum ('hourly', 'fixed');
create type public.payout_method as enum ('gcash', 'maya');
create type public.notification_type as enum ('booking', 'message', 'verification', 'system');

-- ── updated_at Helper ────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════

-- ── Table: users ─────────────────────────────────────────────
create table public.users (
  id                uuid             primary key references auth.users(id) on delete cascade,
  phone             text             not null unique,
  email             text,
  first_name        text             not null,
  last_name         text             not null,
  date_of_birth     date,
  profile_photo_url text,
  bio               text,
  location_lat      double precision,
  location_lng      double precision,
  role              public.user_role not null default 'customer',
  is_available      boolean          not null default false,
  dark_mode         boolean          not null default false,
  created_at        timestamptz      not null default now(),
  updated_at        timestamptz      not null default now()
);

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, phone, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Table: verifications ─────────────────────────────────────
create table public.verifications (
  id                    uuid                       primary key default gen_random_uuid(),
  user_id               uuid                       not null unique references public.users(id) on delete cascade,
  status                public.verification_status not null default 'not_submitted',
  id_type               text,
  id_number             text,
  id_front_url          text,
  id_back_url           text,
  police_clearance_ref  text,
  police_clearance_date date,
  police_clearance_url  text,
  rejection_reason      text,
  submitted_at          timestamptz,
  reviewed_at           timestamptz,
  created_at            timestamptz                not null default now()
);

create index verifications_status_idx on public.verifications(status);

-- ── Table: categories ────────────────────────────────────────
create table public.categories (
  id         uuid    primary key default gen_random_uuid(),
  slug       text    not null unique,
  name       text    not null,
  icon_name  text    not null,
  bg_color   text    not null,
  icon_color text    not null,
  sort_order integer not null default 0
);

create index categories_sort_order_idx on public.categories(sort_order);

-- ── Table: job_posts ─────────────────────────────────────────
create table public.job_posts (
  id               uuid                primary key default gen_random_uuid(),
  customer_id      uuid                not null references public.users(id) on delete cascade,
  title            text                not null,
  description      text                not null,
  address          text                not null,
  location_lat     double precision,
  location_lng     double precision,
  category_slug    text                not null references public.categories(slug) on update cascade,
  skills_needed    text[]              not null default '{}',
  pricing_type     public.pricing_type not null,
  budget_max       numeric(12, 2)      not null,
  workers_needed   integer             not null default 1,
  scheduled_date   date                not null,
  estimated_hours  numeric(6, 2),
  start_time       time,
  end_time         time,
  what_is_included text[]              not null default '{}',
  status           public.job_status   not null default 'open',
  created_at       timestamptz         not null default now(),
  updated_at       timestamptz         not null default now()
);

create index job_posts_customer_id_idx    on public.job_posts(customer_id);
create index job_posts_category_slug_idx  on public.job_posts(category_slug);
create index job_posts_status_idx         on public.job_posts(status);
create index job_posts_scheduled_date_idx on public.job_posts(scheduled_date);
create index job_posts_created_at_idx     on public.job_posts(created_at desc);

create trigger job_posts_updated_at
  before update on public.job_posts
  for each row execute function public.set_updated_at();

-- ── Table: bookings ──────────────────────────────────────────
create table public.bookings (
  id           uuid                  primary key default gen_random_uuid(),
  job_post_id  uuid                  not null references public.job_posts(id) on delete cascade,
  worker_id    uuid                  not null references public.users(id) on delete cascade,
  customer_id  uuid                  not null references public.users(id) on delete cascade,
  status       public.booking_status not null default 'pending',
  worker_note  text,
  created_at   timestamptz           not null default now(),
  updated_at   timestamptz           not null default now()
);

create index bookings_job_post_id_idx on public.bookings(job_post_id);
create index bookings_worker_id_idx   on public.bookings(worker_id);
create index bookings_customer_id_idx on public.bookings(customer_id);
create index bookings_status_idx      on public.bookings(status);
create index bookings_created_at_idx  on public.bookings(created_at desc);

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ── Table: chats ─────────────────────────────────────────────
create table public.chats (
  id            uuid        primary key default gen_random_uuid(),
  booking_id    uuid        not null unique references public.bookings(id) on delete cascade,
  participant_1 uuid        not null references public.users(id) on delete cascade,
  participant_2 uuid        not null references public.users(id) on delete cascade,
  created_at    timestamptz not null default now()
);

create index chats_participant_1_idx on public.chats(participant_1);
create index chats_participant_2_idx on public.chats(participant_2);

-- ── Table: messages ──────────────────────────────────────────
create table public.messages (
  id         uuid        primary key default gen_random_uuid(),
  chat_id    uuid        not null references public.chats(id) on delete cascade,
  sender_id  uuid        not null references public.users(id) on delete cascade,
  content    text        not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index messages_chat_id_idx    on public.messages(chat_id);
create index messages_sender_id_idx  on public.messages(sender_id);
create index messages_created_at_idx on public.messages(created_at asc);

-- ── Table: payout_details ────────────────────────────────────
create table public.payout_details (
  id             uuid                 primary key default gen_random_uuid(),
  user_id        uuid                 not null references public.users(id) on delete cascade,
  method         public.payout_method not null,
  account_name   text                 not null,
  account_number text                 not null,
  created_at     timestamptz          not null default now(),
  updated_at     timestamptz          not null default now(),
  unique (user_id, method)
);

create trigger payout_details_updated_at
  before update on public.payout_details
  for each row execute function public.set_updated_at();

-- ── Table: notifications ─────────────────────────────────────
create table public.notifications (
  id         uuid                     primary key default gen_random_uuid(),
  user_id    uuid                     not null references public.users(id) on delete cascade,
  title      text                     not null,
  body       text                     not null,
  type       public.notification_type not null,
  data       jsonb                    not null default '{}'::jsonb,
  read       boolean                  not null default false,
  created_at timestamptz              not null default now()
);

create index notifications_user_id_idx    on public.notifications(user_id);
create index notifications_unread_idx     on public.notifications(user_id, read) where read = false;
create index notifications_created_at_idx on public.notifications(created_at desc);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

-- ── users ─────────────────────────────────────────────────────
alter table public.users enable row level security;

create policy "users: own row select"
  on public.users for select
  using (auth.uid() = id);

create policy "users: own row update"
  on public.users for update
  using (auth.uid() = id);

-- INSERT is handled by the handle_new_user security-definer trigger;
-- no public INSERT policy is needed.

-- ── verifications ─────────────────────────────────────────────
alter table public.verifications enable row level security;

create policy "verifications: own row select"
  on public.verifications for select
  using (auth.uid() = user_id);

create policy "verifications: own row insert"
  on public.verifications for insert
  with check (auth.uid() = user_id);

create policy "verifications: own row update"
  on public.verifications for update
  using (auth.uid() = user_id);

-- ── categories ────────────────────────────────────────────────
alter table public.categories enable row level security;

create policy "categories: public read"
  on public.categories for select
  using (true);

-- ── job_posts ─────────────────────────────────────────────────
alter table public.job_posts enable row level security;

create policy "job_posts: authenticated read"
  on public.job_posts for select
  to authenticated
  using (true);

create policy "job_posts: customer insert"
  on public.job_posts for insert
  with check (auth.uid() = customer_id);

create policy "job_posts: owner update"
  on public.job_posts for update
  using (auth.uid() = customer_id);

create policy "job_posts: owner delete"
  on public.job_posts for delete
  using (auth.uid() = customer_id);

-- ── bookings ──────────────────────────────────────────────────
alter table public.bookings enable row level security;

create policy "bookings: participant select"
  on public.bookings for select
  using (auth.uid() = worker_id or auth.uid() = customer_id);

create policy "bookings: worker insert"
  on public.bookings for insert
  with check (auth.uid() = worker_id);

create policy "bookings: participant update"
  on public.bookings for update
  using (auth.uid() = worker_id or auth.uid() = customer_id);

-- ── chats ─────────────────────────────────────────────────────
alter table public.chats enable row level security;

create policy "chats: participant select"
  on public.chats for select
  using (auth.uid() = participant_1 or auth.uid() = participant_2);

create policy "chats: participant insert"
  on public.chats for insert
  with check (auth.uid() = participant_1 or auth.uid() = participant_2);

-- ── messages ──────────────────────────────────────────────────
alter table public.messages enable row level security;

create policy "messages: participant select"
  on public.messages for select
  using (
    exists (
      select 1 from public.chats c
      where c.id = chat_id
        and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
    )
  );

create policy "messages: sender insert"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.chats c
      where c.id = chat_id
        and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
    )
  );

create policy "messages: participant update (mark read)"
  on public.messages for update
  using (
    exists (
      select 1 from public.chats c
      where c.id = chat_id
        and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
    )
  );

-- ── payout_details ────────────────────────────────────────────
alter table public.payout_details enable row level security;

create policy "payout_details: own row select"
  on public.payout_details for select
  using (auth.uid() = user_id);

create policy "payout_details: own row insert"
  on public.payout_details for insert
  with check (auth.uid() = user_id);

create policy "payout_details: own row update"
  on public.payout_details for update
  using (auth.uid() = user_id);

create policy "payout_details: own row delete"
  on public.payout_details for delete
  using (auth.uid() = user_id);

-- ── notifications ─────────────────────────────────────────────
alter table public.notifications enable row level security;

create policy "notifications: own select"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications: own update (mark read)"
  on public.notifications for update
  using (auth.uid() = user_id);

-- INSERT is done server-side with the service role key; no public INSERT policy.

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('verification-docs', 'verification-docs', false)
on conflict (id) do nothing;

-- avatars: owner uploads to their own folder; bucket is public-read
create policy "avatars: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: owner replace"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- verification-docs: private, owner only
create policy "verification-docs: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'verification-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "verification-docs: owner read"
  on storage.objects for select
  using (
    bucket_id = 'verification-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "verification-docs: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'verification-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ═══════════════════════════════════════════════════════════════
-- MORE PAGE — Gallery · Credentials · Display preference
-- (Added after launch — run this block to enable those features.)
-- ═══════════════════════════════════════════════════════════════

-- ── Table: worker_photos ──────────────────────────────────────
create table public.worker_photos (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  photo_url  text        not null,
  created_at timestamptz not null default now()
);

create index worker_photos_user_id_idx on public.worker_photos(user_id);

alter table public.worker_photos enable row level security;

create policy "worker_photos: anyone can view"
  on public.worker_photos for select
  using (true);

create policy "worker_photos: owner insert"
  on public.worker_photos for insert
  with check (auth.uid() = user_id);

create policy "worker_photos: owner delete"
  on public.worker_photos for delete
  using (auth.uid() = user_id);

-- ── Table: credentials ───────────────────────────────────────
create table public.credentials (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.users(id) on delete cascade,
  title        text        not null,
  issuer       text,
  document_url text        not null,
  created_at   timestamptz not null default now()
);

create index credentials_user_id_idx on public.credentials(user_id);

alter table public.credentials enable row level security;

create policy "credentials: anyone can view"
  on public.credentials for select
  using (true);

create policy "credentials: owner insert"
  on public.credentials for insert
  with check (auth.uid() = user_id);

create policy "credentials: owner delete"
  on public.credentials for delete
  using (auth.uid() = user_id);

-- ── Table: announcements ─────────────────────────────────────
create table public.announcements (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  body         text        not null,
  published    boolean     not null default true,
  created_at   timestamptz not null default now()
);

create index announcements_published_idx on public.announcements(published, created_at desc);

alter table public.announcements enable row level security;

create policy "announcements: anyone can view published"
  on public.announcements for select
  using (published = true);

-- ── Table: saved_workers ──────────────────────────────────────
create table public.saved_workers (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references public.users(id) on delete cascade,
  worker_id   uuid        not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (customer_id, worker_id)
);

create index saved_workers_customer_id_idx on public.saved_workers(customer_id);

alter table public.saved_workers enable row level security;

create policy "saved_workers: owner select"
  on public.saved_workers for select
  using (auth.uid() = customer_id);

create policy "saved_workers: owner insert"
  on public.saved_workers for insert
  with check (auth.uid() = customer_id);

create policy "saved_workers: owner delete"
  on public.saved_workers for delete
  using (auth.uid() = customer_id);

-- ── Fix: bookings insert policy only allowed the worker to create a
-- booking (the old flow: worker applies to an existing job post).
-- The new "Hire" flow lets a customer book a worker directly, so the
-- customer must also be allowed to insert.
drop policy if exists "bookings: worker insert" on public.bookings;

create policy "bookings: participant insert"
  on public.bookings for insert
  with check (auth.uid() = worker_id or auth.uid() = customer_id);

-- ── Fix: booking_status was missing 'in_progress', so a booking
-- could never actually reach 'completed' through the real UI flow
-- (BookingActions.tsx "Start Job" sets status to 'in_progress').
alter type public.booking_status add value if not exists 'in_progress';

-- ── Table: services ──────────────────────────────────────────
create table public.services (
  id           uuid                 primary key default gen_random_uuid(),
  worker_id    uuid                 not null references public.users(id) on delete cascade,
  title        text                 not null,
  description  text                 not null,
  price        numeric(12, 2)       not null,
  pricing_type public.pricing_type  not null default 'fixed',
  photo_url    text,
  created_at   timestamptz          not null default now(),
  updated_at   timestamptz          not null default now()
);

create index services_worker_id_idx on public.services(worker_id);

alter table public.services enable row level security;

create policy "services: anyone can view"
  on public.services for select
  using (true);

create policy "services: owner insert"
  on public.services for insert
  with check (auth.uid() = worker_id);

create policy "services: owner update"
  on public.services for update
  using (auth.uid() = worker_id);

create policy "services: owner delete"
  on public.services for delete
  using (auth.uid() = worker_id);

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ── Table: reviews ───────────────────────────────────────────
-- One review per completed booking, written by the customer.
create table public.reviews (
  id          uuid        primary key default gen_random_uuid(),
  booking_id  uuid        not null unique references public.bookings(id) on delete cascade,
  customer_id uuid        not null references public.users(id) on delete cascade,
  worker_id   uuid        not null references public.users(id) on delete cascade,
  rating      smallint    not null check (rating between 1 and 5),
  tags        text[]      not null default '{}',
  comment     text,
  created_at  timestamptz not null default now()
);

create index reviews_worker_id_idx on public.reviews(worker_id);

alter table public.reviews enable row level security;

create policy "reviews: anyone can view"
  on public.reviews for select
  using (true);

create policy "reviews: customer insert for their own completed booking"
  on public.reviews for insert
  with check (
    auth.uid() = customer_id
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.customer_id = auth.uid()
        and b.worker_id = reviews.worker_id
        and b.status = 'completed'
    )
  );

-- ── Storage: service-photos bucket (public read, owner write) ──
create policy "service-photos: public read"
  on storage.objects for select
  using (bucket_id = 'service-photos');

create policy "service-photos: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'service-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "service-photos: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'service-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── users: Auto / Light / Dark display preference ──────────────
alter table public.users
  add column if not exists theme_preference text not null default 'auto'
    check (theme_preference in ('auto', 'light', 'dark'));

-- ── Storage: gallery-photos bucket (public read, owner write) ──
create policy "gallery-photos: public read"
  on storage.objects for select
  using (bucket_id = 'gallery-photos');

create policy "gallery-photos: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "gallery-photos: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'gallery-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── Storage: credentials-docs bucket (private, owner only) ──────
create policy "credentials-docs: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'credentials-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "credentials-docs: owner read"
  on storage.objects for select
  using (
    bucket_id = 'credentials-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "credentials-docs: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'credentials-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── Storage: support-attachments bucket (public read, owner write) ──
-- Links to uploaded screenshots are included in the mailto body on the
-- Help & Support page, so the recipient can open them without a login.
create policy "support-attachments: public read"
  on storage.objects for select
  using (bucket_id = 'support-attachments');

create policy "support-attachments: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'support-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════

insert into public.categories (slug, name, icon_name, bg_color, icon_color, sort_order) values
  ('handyman',    'Handyman',    'hammer',          '#F0E6FF', '#7B4FBF', 1),
  ('it',          'IT',          'laptop',          '#E7F0FD', '#1877F2', 2),
  ('massage',     'Massage',     'flower-2',        '#FFE6F0', '#D6336C', 3),
  ('consultancy', 'Consultancy', 'handshake',       '#E6F4EA', '#1DA462', 4),
  ('drone',       'Drone',       'plane',           '#E6F7F7', '#1B9E9E', 5),
  ('cleaning',    'Cleaning',    'sparkles',        '#E7F0FD', '#1877F2', 6),
  ('repairs',     'Repairs',     'wrench',          '#FFF0E6', '#E87722', 7),
  ('deliveries',  'Deliveries',  'package',         '#E6F4EA', '#1DA462', 8),
  ('petcare',     'Pet Care',    'paw-print',       '#E6F7F7', '#1B9E9E', 9),
  ('cooking',     'Cooking',     'chef-hat',        '#FFF8E6', '#E8A020', 10),
  ('other',       'Other',       'more-horizontal', '#F0F2F5', '#65676B', 11)
on conflict (slug) do update set
  name       = excluded.name,
  icon_name  = excluded.icon_name,
  bg_color   = excluded.bg_color,
  icon_color = excluded.icon_color,
  sort_order = excluded.sort_order;
