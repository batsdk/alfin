# Session lifecycle

Part of [Authentication](index.md).

## Returning to the requested page

When a logged-out user is turned away, the proxy and `AuthGuard` both build the login URL with `loginUrl(path + query)`. For example, `/subscriptions?tab=all` becomes `/login?redirect=%2Fsubscriptions%3Ftab%3Dall`.

After a successful login or sign-up, the form reads that param and replaces the URL, so the browser's Back button doesn't return to the form:

```ts
router.replace(getSafeRedirect(new URLSearchParams(window.location.search).get('redirect')));
```

`GuestGuard` does the same for users who open `/login` or `/signup` while already signed in. The redirect param also works on `/signup`.

## Safe redirects

`getSafeRedirect(value)` in `lib/auth-routes.ts` returns `value` only if it starts with `/` and not with `//` or `/\` (browsers treat both as links to another host). Anything else, including a missing value, gives `DEFAULT_APP_PATH` (`/subscriptions`). This stops `?redirect=https://evil.example` or `?redirect=//evil.example` from sending users off-site.

## Signing out

```ts
authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      queryClient.clear(); // drop cached data so the next user never sees it
      router.replace('/login');
    },
  },
});
```

The API clears the session cookie in its response. Clearing the React Query cache matters on shared computers: without it, the next person to sign in could briefly see the previous user's data.

## Session expiry

The API's sessions last 14 days and are extended at most once a day while the user is active (`session.expiresIn` and `session.updateAge` in `../api/src/auth/auth.ts`).

When a session expires or is revoked while the app is open, the next API call returns 401. `redirectOnUnauthorized` in `lib/query-client.ts` handles it for every query and mutation:

```ts
window.location.replace(loginUrl(window.location.pathname + window.location.search));
```

It deliberately does a full page load instead of a client-side navigation, so React Query, zustand and better-auth's cached session are all thrown away together. On the next load, `/login` gets a fresh session check.

## Not yet verified

These flows are implemented but haven't been tested against the real API: the 401 reload, sign-out, and a real login returning to the requested page. They need the API, Postgres and a `.env` running.
