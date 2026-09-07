import { DEFAULT_TOOL_SLUG } from "./tools";

/** Only same-origin app/pricing paths are ever honored — never an
 * external URL from a query param. */
export function safeRedirectPath(redirect: string | undefined): string {
  if (redirect && (redirect.startsWith("/app") || redirect.startsWith("/pricing"))) {
    return redirect;
  }
  return `/app/${DEFAULT_TOOL_SLUG}`;
}
