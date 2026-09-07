-- Fixes 0000_better_auth.sql, which was generated via the deprecated
-- @better-auth/cli package (pinned around the 1.4.x/1.5.0-beta schema
-- shape) against the actually-installed better-auth@1.7.2 core library.
-- Runtime failed with "table account has no column named issuer" on the
-- first real signup. Regenerated correctly via
-- worker-api/scripts/generate-schema.mjs, which calls the installed
-- library's own getMigrations()/compileMigrations() directly.
--
-- Safe to drop and recreate: no real users exist yet (pre-launch dev).
drop index if exists "session_userId_idx";
drop index if exists "account_userId_idx";
drop index if exists "verification_identifier_idx";
drop table if exists "account";
drop table if exists "session";
drop table if exists "verification";
drop table if exists "user";

create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" integer not null, "image" text, "createdAt" date not null, "updatedAt" date not null);

create table "session" ("id" text not null primary key, "expiresAt" date not null, "token" text not null unique, "createdAt" date not null, "updatedAt" date not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id") on delete cascade);

create table "account" ("id" text not null primary key, "issuer" text not null, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" date, "refreshTokenExpiresAt" date, "scope" text, "password" text, "createdAt" date not null, "updatedAt" date not null);

create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" date not null, "createdAt" date not null, "updatedAt" date not null);

create index "session_userId_idx" on "session" ("userId");

create index "account_userId_idx" on "account" ("userId");

create index "verification_identifier_idx" on "verification" ("identifier");

create unique index "account_issuer_accountId_uidx" on "account" ("issuer", "accountId");
