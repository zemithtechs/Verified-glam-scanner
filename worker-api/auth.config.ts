import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import bcrypt from "bcryptjs";

/**
 * CLI-only config for `npx @better-auth/cli generate`. The real D1 binding
 * only exists inside the Workers runtime (see src/auth.ts for the actual
 * per-request factory the Worker uses); `generate` just needs enough of a
 * D1Database shape to not crash while it emits schema SQL, it doesn't run
 * real queries.
 */
const emptyMeta = {
  changes: 0,
  last_row_id: 0,
  duration: 0,
  rows_read: 0,
  rows_written: 0,
  size_after: 0,
};
const stubResult = { success: true, results: [], meta: emptyMeta };
const stubD1 = {
  prepare: () => ({
    bind: () => ({
      all: async () => stubResult,
      run: async () => stubResult,
      first: async () => null,
      raw: async () => [],
    }),
    all: async () => stubResult,
    run: async () => stubResult,
    first: async () => null,
  }),
  batch: async () => [],
  exec: async () => ({ count: 0, duration: 0 }),
} as unknown as D1Database;

export const auth = betterAuth({
  database: { db: new Kysely({ dialect: new D1Dialect({ database: stubD1 }) }), type: "sqlite" },
  secret: "cli-schema-generation-only",
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password: string) => bcrypt.hash(password, 10),
      verify: ({ hash, password }: { hash: string; password: string }) => bcrypt.compare(password, hash),
    },
  },
  socialProviders: {
    google: { clientId: "placeholder", clientSecret: "placeholder" },
  },
});
