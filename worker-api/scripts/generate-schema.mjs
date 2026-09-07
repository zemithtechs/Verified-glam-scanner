// Generates Better Auth's D1 schema directly from the installed better-auth
// package (1.7.2) via its own getMigrations()/compileMigrations(), bypassing
// the separate @better-auth/cli package — that package is deprecated and
// pinned around the 1.4.x/1.5.0-beta schema shape, which caused a real
// runtime mismatch (missing account.issuer column) against this installed
// 1.7.2 core library. Calling the library's own generator guarantees the
// SQL matches what better-auth actually expects at runtime.
import { bearer } from "better-auth/plugins";
// getMigrations isn't re-exported from the public "better-auth/db" entry,
// so this imports the installed package's actual file directly (a relative
// path bypasses Node's package.json "exports" restriction) — guarantees the
// exact same generator the runtime's "1.7.2" better-auth uses internally.
import { getMigrations } from "../node_modules/better-auth/dist/db/get-migration.mjs";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import bcrypt from "bcryptjs";
import { writeFileSync } from "node:fs";

const emptyMeta = { changes: 0, last_row_id: 0, duration: 0, rows_read: 0, rows_written: 0, size_after: 0 };
const stubResult = { success: true, results: [], meta: emptyMeta };
const stubD1 = {
  prepare: () => ({
    bind: () => ({ all: async () => stubResult, run: async () => stubResult, first: async () => null, raw: async () => [] }),
    all: async () => stubResult,
    run: async () => stubResult,
    first: async () => null,
  }),
  batch: async () => [],
  exec: async () => ({ count: 0, duration: 0 }),
};

const options = {
  database: { db: new Kysely({ dialect: new D1Dialect({ database: stubD1 }) }), type: "sqlite" },
  secret: "cli-schema-generation-only",
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password) => bcrypt.hash(password, 10),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  socialProviders: {
    google: { clientId: "placeholder", clientSecret: "placeholder" },
  },
  plugins: [bearer()],
};

const { compileMigrations } = await getMigrations(options);
const sql = await compileMigrations();
writeFileSync(new URL("../migrations/0000_better_auth.sql", import.meta.url), sql);
console.log(sql);
