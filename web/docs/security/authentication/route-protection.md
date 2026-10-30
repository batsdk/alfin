# Route protection

Part of [Authentication](index.md).

Three pieces work together:

| Piece | Runs | Checks | Does |
| --- | --- | --- | --- |
| `proxy.ts` | Server, before every page request | Does a session cookie exist? | No cookie: redirect to `/login?redirect=<path>` |
| `AuthGuard` (`components/auth/auth-guard.tsx`) | Browser, in `app/(app)/layout.tsx` | Is the session valid? (asks the API) | Spinner while checking; no session: redirect to login; otherwise render the page |
| `GuestGuard` (`components/auth/guest-guard.tsx`) | Browser, in `app/(auth)/layout.tsx` | Is the session valid? | Signed in: redirect to the `redirect` target or `/subscriptions` |

The route rules are shared from `lib/auth-routes.ts`, which has no React or Next imports so both the proxy and the client can use it:

- `PUBLIC_PATHS`: `/`, `/login`, `/signup`. Every other path requires a session.
- `DEFAULT_APP_PATH`: `/subscriptions`.
- `loginUrl(returnTo)`: `/login?redirect=<encoded path and query>`.
- `getSafeRedirect(value)`: see [Session lifecycle](session-lifecycle.md#safe-redirects).

## Proxy

```ts
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isPublicPath(pathname) || getSessionCookie(request)) return NextResponse.next();
  return NextResponse.redirect(new URL(loginUrl(pathname + search), request.url));
}
```

- `getSessionCookie` from `better-auth/cookies` checks both cookie names (plain and `__Secure-`). It only checks that the cookie exists and never validates it.
- The matcher skips `_next/static`, `_next/image`, `favicon.ico` and any path with a file extension, so public files like `/next.svg` aren't blocked.
- Keep the proxy free of API and database calls. It runs on every request, including prefetches.

## Why the guards are split this way

A cookie can exist and still be stale, for example when the session has expired or been revoked. So:

- **Missing cookie means logged out, for sure.** The proxy redirects only in that case.
- **"Already logged in" is only decided after asking the API.** That's why the redirect away from `/login` lives in `GuestGuard`, not in the proxy.

If the proxy also redirected `/login` → `/subscriptions` whenever a cookie existed, a stale cookie would loop forever between the proxy and `AuthGuard`.

| Situation | What happens |
| --- | --- |
| No cookie, opens `/subscriptions` | Proxy: 307 to `/login?redirect=%2Fsubscriptions` |
| Stale cookie, opens `/subscriptions` | Proxy lets it through, `AuthGuard` gets no session and replaces the URL with `/login?redirect=…`, and the user stays on `/login` |
| Valid session, opens `/subscriptions` | Page renders |
| Valid session, opens `/login` | `GuestGuard` sends them to `/subscriptions` (or the `redirect` target) |

All four were checked against a production build with a stand-in API.

## Production cookie requirement

The session cookie is set by the API's host. Locally, web (`localhost:3000`) and API (`localhost:8000`) share it, because cookies aren't separated by port. In production `proxy.ts` only sees the cookie if one of these holds:

- Web and API are subdomains of the same domain (for example `app.example.com` and `api.example.com`), and the API's better-auth config sets the cookie on the parent domain (its cross-subdomain cookie option).
- The API is served from the web app's own origin (for example through a rewrite), so the cookie is first-party.

If neither holds, the proxy sends every visitor to `/login`, including logged-in ones. In that case, remove `proxy.ts`: `AuthGuard` alone still protects the pages.

## Adding pages

- **Signed-in page:** put it in `app/(app)/`. Both layers apply automatically.
- **Public page:** put it outside `app/(app)/` and add its path to `PUBLIC_PATHS`.
- **Guest-only page** (like `/login`): put it in `app/(auth)/` and add it to `PUBLIC_PATHS`.
