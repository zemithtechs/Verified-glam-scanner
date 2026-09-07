-- Free tier: only FACE_BEAUTY_ANALYSIS is reachable without a subscription,
-- capped at a lifetime total (see lib/credits.ts FREE_FACE_SCAN_LIMIT).
-- All other feature types already require is_pro via checkCredits().
alter table profiles add column free_face_scans_used integer not null default 0;
