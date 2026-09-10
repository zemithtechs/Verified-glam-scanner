// Simple email allowlist rather than a DB flag — the grant works the
// moment this email signs in, with no dependency on that account already
// existing or a migration to add an is_admin column. Add more emails here
// as needed.
const ADMIN_EMAILS = new Set(["komolafebamidele@rocketmail.com"]);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}
