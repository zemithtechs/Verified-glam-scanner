-- Persistent profile picture, shown in the nav, account settings, and
-- anywhere else a user's identity appears (e.g. their own Showdown podium
-- slot). Populated at signup (Google's photo, or a Gravatar lookup — see
-- src/auth.ts) and overwritable via POST /profiles/me/avatar.
alter table profiles add column avatar_url text;
