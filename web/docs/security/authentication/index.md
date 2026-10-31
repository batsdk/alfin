# Authentication

Authentication uses [better-auth](https://www.better-auth.com) with email and password. The server half runs in the API; the web app uses better-auth's React client.

In this folder:

- [Route protection](route-protection.md): `proxy.ts`, `AuthGuard` and `GuestGuard`, and how they avoid redirect loops
- [Session lifecycle](session-lifecycle.md): redirects after login, sign-out, expired sessions

Back to [Security](../index.md) · [docs](../../index.md).

## Server and client

| Side | File | Setup |
| --- | --- | --- |
| API | `../api/src/auth/auth.ts` | Email + password (minimum 10 characters), 14-day sessions extended at most once a day while active, `trustedOrigins: [WEB_ORIGIN]`, bearer plugin for non-browser clients |
| Web | `lib/auth-client.ts` | `createAuthClient` with `baseURL: NEXT_PUBLIC_API_URL`, `credentials: "include"`, and an `onRequest` hook that adds `x-tract-id` |

## Session cookie

After sign-in, the API sets `better-auth.session_token` (named `__Secure-better-auth.session_token` over HTTPS). It is `httpOnly`, so page scripts can't read it. The browser sends it with every request to the API because both clients use `credentials: "include"`.

## Flows

| Flow | Where | Call |
| --- | --- | --- |
| Sign up | `components/auth/signup-form.tsx` | `authClient.signUp.email({ name, email, password })` |
| Log in | `components/auth/login-form.tsx` | `authClient.signIn.email({ email, password })` |
| Sign out | `app/(app)/subscriptions/page.tsx` | `authClient.signOut({ fetchOptions: { onSuccess } })` |
| Current session | Guards and pages | `authClient.useSession()` or `useAuthenticatedSession()` |

better-auth client calls don't throw on failure. They return `{ data, error }`, so check `error`:

```ts
const { error } = await authClient.signIn.email(values);
if (error) {
  toast.error(error.message ?? 'Could not log in');
  return;
}
```

## Reading the session

**Inside `app/(app)/`**, use `useAuthenticatedSession()` from `components/auth/auth-guard.tsx`. `AuthGuard` only renders the page once a session exists, so the hook returns `{ user, session }` typed as always present:

```ts
const { user } = useAuthenticatedSession();
```

**Anywhere else**, use `authClient.useSession()`, which returns `{ data, isPending, error }` where `data` can be `null`. The session is shared across components, so calling it in several places doesn't make extra requests.

Don't copy the session into zustand or React Query; better-auth already caches it. See [State management](../../state-management/index.md).
