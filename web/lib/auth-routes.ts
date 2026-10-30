// Route rules shared by proxy.ts (server) and the auth guards (client), so keep
// this module free of React and Next imports.

// Everything else requires a session, so new pages are protected by default
export const PUBLIC_PATHS = ["/", "/login", "/signup"];

export const DEFAULT_APP_PATH = "/subscriptions";

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

// Login URL that brings the user back to `returnTo` (path + search) after logging in
export function loginUrl(returnTo: string) {
  return `/login?redirect=${encodeURIComponent(returnTo)}`;
}

// Only same-site paths are allowed, so ?redirect= can't send users to another site.
// "//host" and "/\host" are treated by browsers as protocol-relative URLs.
export function getSafeRedirect(value: string | null | undefined) {
  if (value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) {
    return value;
  }
  return DEFAULT_APP_PATH;
}
