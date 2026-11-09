-- Saved results from the AI Beauty Styling tools ("My creations").
-- The image itself lives in R2 under "<user id>/creations/<id>.png", so deleting an account
-- (which wipes the "<user id>/" prefix and cascades these rows) removes everything.

create table if not exists creations (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  tool_slug text not null,
  tool_name text not null,
  storage_path text not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create index if not exists creations_user_created_idx on creations (user_id, created_at desc);
