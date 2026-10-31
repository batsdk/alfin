# Routing

Part of [Architecture](index.md).

## Routes

| URL | File | Access |
| --- | --- | --- |
| `/` | `app/page.tsx` | Public. Still the create-next-app starter page. |
| `/login` | `app/(auth)/login/page.tsx` | Public. Signed-in users are sent into the app. |
| `/signup` | `app/(auth)/signup/page.tsx` | Public. Signed-in users are sent into the app. |
| `/subscriptions` | `app/(app)/subscriptions/page.tsx` | Signed in |

## Route groups

Folders in parentheses group routes without adding to the URL.

- `app/(auth)/layout.tsx` is the split-screen auth layout: the form column on the left and a product panel on large screens. It wraps the page in `GuestGuard`.
- `app/(app)/layout.tsx` wraps every page in `AuthGuard`, so a page only renders once the session is confirmed.

How the guards work is in [Route protection](../security/authentication/route-protection.md).

## Adding a page

**A signed-in page** goes in `app/(app)/<name>/page.tsx`. That is all you need for protection: `proxy.ts` blocks requests without a session cookie (the path isn't public), and the group layout adds `AuthGuard`. Read the user with `useAuthenticatedSession()`:

```tsx
'use client';
import { useAuthenticatedSession } from '@/components/auth/auth-guard';

export default function SettingsPage() {
  const { user } = useAuthenticatedSession();
  return <p>{user.email}</p>;
}
```

**A public page** goes outside `app/(app)/`, and its path must be added to `PUBLIC_PATHS` in `lib/auth-routes.ts`. Otherwise `proxy.ts` redirects logged-out visitors to `/login`.

## Special files

| File | Role |
| --- | --- |
| `app/layout.tsx` | Root layout: fonts, `globals.css`, metadata, `Providers` |
| `app/providers.tsx` | Client providers ([provider tree](index.md#provider-tree)) |
| `app/error.tsx` | Error boundary for pages ([Error boundaries](../error-handling/error-boundaries.md)) |
| `app/global-error.tsx` | Error boundary for the root layout |
| `proxy.ts` | Runs before matched requests ([Route protection](../security/authentication/route-protection.md)) |

## Page titles

The root layout sets `title: { default: "Allfin", template: "%s | Allfin" }`. A page that is a Server Component sets its own title, for example `export const metadata: Metadata = { title: 'Log in' }`, which renders as "Log in | Allfin".

A `'use client'` page can't export `metadata`, so `/subscriptions` currently shows the default "Allfin". To give a client page a title, export `metadata` from a server `layout.tsx` next to it.
