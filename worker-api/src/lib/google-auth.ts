import { createRemoteJWKSet, jwtVerify } from "jose";

// Verifies the ID token Flutter's native google_sign_in package returns.
// Better Auth's Google provider only handles browser OAuth-redirect flow —
// there's no built-in "trust this token" endpoint for native sign-in, so
// this is the custom verification the migration plan flagged as needed
// (docs/CLOUDFLARE_MIGRATION_PLAN.md — "Native Google sign-in").
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export type GoogleIdTokenClaims = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

export async function verifyGoogleIdToken(idToken: string, audience: string): Promise<GoogleIdTokenClaims> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience,
  });

  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("Google ID token missing sub/email");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    email_verified: payload.email_verified === true,
    name: typeof payload.name === "string" ? payload.name : undefined,
    picture: typeof payload.picture === "string" ? payload.picture : undefined,
  };
}
