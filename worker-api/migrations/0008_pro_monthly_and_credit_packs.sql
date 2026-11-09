-- Pay-as-you-go credit packs: a separate balance that never expires and is not touched by
-- subscription renewals or cancellations, plus one row per Polar order so a redelivered
-- webhook can never credit the same purchase twice.

alter table profiles add column purchased_credits integer not null default 0;

create table if not exists credit_purchases (
  polar_order_id text primary key,
  user_id text not null references profiles (id) on delete cascade,
  amount_cents integer not null,
  credits integer not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create index if not exists credit_purchases_user_idx on credit_purchases (user_id);

-- New plan allowances. The yearly plan moves from 200 to 2,400 credits only if the admin setting
-- is still the old default, so a value changed on purpose in the admin dashboard is left alone.
update app_content set value = '2400' where key = 'admin.annual_credits' and value = '200';
insert or ignore into app_content (key, value) values ('admin.monthly_credits', '200');
insert or ignore into app_content (key, value) values ('admin.trial_credits', '20');
