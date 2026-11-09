-- Free-result limits for the public AI Beauty Styling site (aibeautystyling.com).
-- Visitors are counted by a one-way hash of their IP address, per day, so no IP address is stored.
-- A global daily total caps overall spend no matter how many visitors arrive.

create table if not exists visitor_generations (
  ip_hash text not null,
  day text not null,
  count integer not null default 0,
  primary key (ip_hash, day)
);

create table if not exists daily_generation_totals (
  day text primary key,
  count integer not null default 0
);
