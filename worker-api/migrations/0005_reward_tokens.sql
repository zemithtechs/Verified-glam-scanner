-- Free-tier gate for FACE_BEAUTY_ANALYSIS: replaces the lifetime scan
-- counter (0004) with "watch a rewarded ad, unlock one scan" — each token
-- is minted after a client-reported earned reward and consumed exactly
-- once by the analyze route (see lib/reward-tokens.ts).
create table reward_tokens (
  token text primary key,
  user_id text not null references "user" (id) on delete cascade,
  feature_type text not null,
  issued_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at text not null,
  consumed_at text
);

create index reward_tokens_user_id_idx on reward_tokens (user_id);
