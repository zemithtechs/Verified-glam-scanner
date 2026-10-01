-- Verified Glam — D1 app schema, ported from supabase/migrations/001-013.
-- Type conversions: uuid -> text (app generates via crypto.randomUUID()),
-- jsonb -> text (JSON-stringified), timestamptz -> text (ISO-8601, UTC),
-- date -> text (YYYY-MM-DD), boolean -> integer (0/1).
-- RLS policies are dropped: enforcement moves to explicit `WHERE user_id = ?`
-- guards in Worker routes, driven by the Better Auth session (see
-- src/middleware/session.ts and docs/CLOUDFLARE_MIGRATION_PLAN.md).
-- References to auth.users(id) become references to Better Auth's `user`
-- table (0000_better_auth.sql), since migrated user IDs are preserved as-is.

create table profiles (
  id text primary key references "user" (id) on delete cascade,
  email text,
  display_name text,
  age integer,
  gender text,
  beauty_goals text not null default '[]',
  skin_concerns text not null default '[]',
  product_preferences text not null default '[]',
  skin_type text,
  ethnicity text,
  aesthetic text,
  onboarding_complete integer not null default 0,
  referral_code text unique,
  referral_download_count integer not null default 0,
  bonus_scans integer not null default 0,
  referral_bonus_redeemed integer not null default 0,
  is_pro integer not null default 0,
  daily_scan_count integer not null default 0,
  daily_scan_date text,
  subscription_plan text not null default 'free',
  credits_balance integer not null default 10,
  credits_period_key text default 'free-lifetime',
  credits_allocated integer not null default 10,
  polar_customer_id text,
  polar_subscription_id text,
  subscription_status text not null default 'free',
  subscription_current_period_end text,
  showdown_avatar_url text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table scans (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  feature_type text not null,
  feature_title text not null,
  photo_storage_path text,
  photo_public_url text,
  payload text not null default '{}',
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
create index scans_user_created_idx on scans (user_id, created_at desc);

create table referral_events (
  id text primary key,
  referrer_id text references profiles (id) on delete set null,
  referred_user_id text references profiles (id) on delete set null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table challenge_plans (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  source_scan_id text references scans (id) on delete set null,
  issue_tag text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  duration_days integer not null check (duration_days in (3, 5, 7)),
  title text not null,
  intro_message text not null,
  disclaimer text not null,
  completed_days integer not null default 0,
  last_completed_at text,
  next_unlock_at text,
  is_completed integer not null default 0,
  streak_count integer not null default 0,
  notification_pref_time text,
  completion_notified_at text,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  last_done_date text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table challenge_days (
  id text primary key,
  challenge_id text not null references challenge_plans (id) on delete cascade,
  user_id text not null references "user" (id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  main_task text not null,
  support_task text not null,
  why_line text not null,
  est_minutes integer not null default 10,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  unique (challenge_id, day_number)
);

create table challenge_progress (
  id text primary key,
  challenge_id text not null references challenge_plans (id) on delete cascade,
  user_id text not null references "user" (id) on delete cascade,
  day_number integer not null check (day_number > 0),
  status text not null check (status in ('locked', 'unlocked', 'done')),
  unlocked_at text,
  completed_at text,
  unlock_notified_at text,
  reminder_sent_at text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  unique (challenge_id, day_number)
);

create table device_push_tokens (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  fcm_token text not null unique,
  platform text not null,
  is_active integer not null default 1,
  last_seen_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- kind check reflects the final state after 3 widenings across
-- 005/007/010_notification_evening_kind.sql: unlock, streak, evening,
-- reminder, completion.
create table challenge_notification_jobs (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  challenge_id text not null references challenge_plans (id) on delete cascade,
  day_number integer not null,
  kind text not null check (kind in ('unlock', 'streak', 'evening', 'reminder', 'completion')),
  scheduled_for text not null,
  sent_at text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'cancelled')),
  payload text not null default '{}',
  dedupe_key text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
create unique index idx_challenge_notification_jobs_dedupe
  on challenge_notification_jobs (dedupe_key) where dedupe_key is not null;
create index idx_challenge_notification_jobs_sent_daily
  on challenge_notification_jobs (user_id, challenge_id, sent_at) where status = 'sent';

create table challenge_badges (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  badge_code text not null,
  badge_title text not null,
  challenge_id text references challenge_plans (id) on delete set null,
  earned_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  unique (user_id, badge_code)
);

create table challenge_reward_cards (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  challenge_id text not null references challenge_plans (id) on delete cascade,
  challenge_title text not null,
  issue_tag text not null,
  completed_on text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  message text not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table credit_transactions (
  id text primary key,
  user_id text not null references profiles (id) on delete cascade,
  amount integer not null,
  kind text not null check (kind in ('subscription_grant', 'period_refresh', 'analysis', 'subscription_revoke')),
  description text not null,
  feature_type text,
  balance_after integer,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
create index credit_transactions_user_created_idx on credit_transactions (user_id, created_at desc);

-- Idempotency log for Polar Standard Webhooks (webhook-id header).
create table polar_webhook_events (
  id text primary key,
  event_type text not null,
  processed_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Beauty tips catalog (static content, seeded in 0002_beauty_tips_seed.sql).
create table beauty_tip_categories (
  id text primary key,
  name text not null,
  short_label text not null,
  color integer not null,
  anchor_x real not null,
  anchor_y real not null,
  label_side text not null,
  issue_tags text not null default '[]',
  sort_order integer not null default 0
);

-- id defaults to a random hex id (not app-controlled) since these rows are
-- static seed content, never referenced by foreign key from elsewhere.
create table beauty_tip_entries (
  id text primary key default (lower(hex(randomblob(16)))),
  category_id text not null references beauty_tip_categories (id) on delete cascade,
  severity text not null check (severity in ('high', 'medium', 'low')),
  title text not null,
  body text not null,
  sort_order integer not null default 0
);
create index beauty_tip_entries_cat_sev_idx on beauty_tip_entries (category_id, severity, sort_order);

create table beauty_spot_label_map (
  id text primary key default (lower(hex(randomblob(16)))),
  issue_tag text not null unique,
  display_label text not null
);

create table app_content (
  key text primary key,
  value text not null
);
