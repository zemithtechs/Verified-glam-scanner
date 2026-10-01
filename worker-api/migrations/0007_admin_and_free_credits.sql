-- Give free accounts a real, finite credit allowance and preserve usage that
-- happened before free scans participated in the credit ledger.
update profiles
set credits_allocated = 10,
    credits_balance = max(0, 10 - 5 * (select count(*) from scans where scans.user_id = profiles.id)),
    credits_period_key = 'free-lifetime'
where is_pro = 0 and subscription_plan = 'free' and credits_allocated = 0;

insert into credit_transactions (id, user_id, amount, kind, description, feature_type, balance_after, created_at)
select lower(hex(randomblob(16))), s.user_id, -5, 'analysis', s.feature_title, s.feature_type,
       max(0, 10 - 5 * (
         select count(*) from scans prior
         where prior.user_id = s.user_id and prior.created_at <= s.created_at
       )),
       s.created_at
from scans s
join profiles p on p.id = s.user_id
where p.is_pro = 0
  and not exists (
    select 1 from credit_transactions t
    where t.user_id = s.user_id and t.kind = 'analysis' and t.created_at = s.created_at
  );

-- Notification history makes admin broadcasts auditable.
create table admin_notifications (
  id text primary key,
  title text not null,
  message text not null,
  notification_type text not null default 'info',
  audience text not null default 'all',
  target_user_id text references profiles (id) on delete set null,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  created_by text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

insert into app_content (key, value) values
  ('admin.free_credits', '10'),
  ('admin.annual_credits', '200'),
  ('admin.weekly_credits', '30'),
  ('admin.maintenance_enabled', 'false'),
  ('admin.maintenance_message', 'We are performing scheduled maintenance.'),
  ('admin.announcement_enabled', 'false'),
  ('admin.announcement_text', ''),
  ('admin.announcement_type', 'info'),
  ('admin.platform_name', 'Verified Glam'),
  ('admin.support_email', '')
on conflict (key) do nothing;
