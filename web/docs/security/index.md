# Security

The API is the security boundary. Every protected endpoint checks the better-auth session and answers 401 without a valid one. The web app's checks are about experience: they keep logged-out users off app screens and send them to log in. Never rely on them to protect data.

In this folder:

- [Authentication](authentication/index.md): sign in, sign up, sign out, sessions and route protection

Back to [docs](../index.md).

## What the web app does

| Concern | How it's handled | Where |
| --- | --- | --- |
| Logged-out users on app pages | Server redirect when there's no session cookie, plus a client check of the real session | `proxy.ts`, `components/auth/auth-guard.tsx` ([Route protection](authentication/route-protection.md)) |
| Open redirects through `?redirect=` | `getSafeRedirect` only accepts same-site paths | `lib/auth-routes.ts` ([Session lifecycle](authentication/session-lifecycle.md)) |
| Session token exposure | The session cookie is set by the API as `httpOnly`. The web app never reads its value; `proxy.ts` only checks that it exists. | `proxy.ts` |
| Data left behind after sign-out | The React Query cache is cleared on sign-out. An unexpected 401 does a full page reload, which drops all in-memory state. | `app/(app)/subscriptions/page.tsx`, `lib/query-client.ts` |
| Cross-origin requests | Every request sends `credentials: "include"`. The API only allows CORS from `WEB_ORIGIN`, and better-auth only trusts that origin. | `lib/api.ts`, `lib/auth-client.ts`, `../api/src/main.ts`, `../api/src/auth/auth.ts` |
| Leaking server error details | In production, Next replaces Server Component error messages with a generic message and a digest. `ErrorFallback` only shows the digest. | `components/error-fallback.tsx` |

## Rules

- **`NEXT_PUBLIC_*` variables are public.** They're inlined into the JavaScript sent to every visitor, so never put secrets in them.
- **The `x-tract-id` header is a correlation id,** not a credential. Don't put user data in it. See [Request tracing](../api-integration/request-tracing.md).
- **Never trust the client for authorization.** Any check that matters must also happen in the API.
- **Mirror API validation in zod schemas for feedback only.** The API validates again. See [Forms](../forms/index.md).

## Open items

- `proxy.ts` only sees the session cookie in production if the web app and the API share a parent domain with cross-subdomain cookies. See [Route protection](authentication/route-protection.md#production-cookie-requirement).
- The 401 reload and the sign-out flow haven't been tested against the real API yet.
