# Rendering

Part of [Architecture](index.md).

## Cache Components

`next.config.ts` enables `cacheComponents` and `partialPrefetching`. Every current route builds as static (`○` in the `pnpm build` output) because no page reads request data on the server:

- `app/(auth)/` pages prerender the full form.
- `app/(app)/` pages prerender the `AuthGuard` loading spinner. The real content renders in the browser once the session is confirmed.

Reading request data in a Server Component (`cookies()`, `headers()`, `searchParams`) makes that part render per request, and under Cache Components it has to sit inside a `<Suspense>` boundary. The bundled guide `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md` covers the patterns.

## Server and client components

- Pages under `app/(auth)/` are Server Components that render client form components.
- `app/(app)/subscriptions/page.tsx` is a client component, because it uses React Query hooks and the session.
- Error boundaries, providers, guards and anything with state or event handlers are client components (`'use client'`).

## Query params and `window`

`useSearchParams()` in a client component on a static route needs a Suspense boundary. This app reads query params from `window.location.search` inside event handlers and effects instead, which runs only in the browser:

```ts
router.replace(getSafeRedirect(new URLSearchParams(window.location.search).get('redirect')));
```

Examples: `components/auth/login-form.tsx`, `components/auth/guest-guard.tsx`, `components/auth/auth-guard.tsx`.

Never read `window` during render. Client components also render on the server, and the first browser render must match that HTML, or React reports a hydration mismatch. `AuthGuard` follows this rule by rendering the same spinner on the server and during the first browser render, while the session is still loading.

## Fonts

`app/fonts.ts` defines Geist (CSS variable `--font-sans`) and Geist Mono (`--font-geist-mono`) with `next/font`, and exports `fontVariables`. Both `app/layout.tsx` and `app/global-error.tsx` put it on `<html>`. See [Theming](../ui-components/theming.md) for how the variables reach Tailwind.

## Proxy

`proxy.ts` runs on the Node.js runtime before every request its matcher covers. Keep it to cheap checks; it must not call the API or a database. See [Route protection](../security/authentication/route-protection.md).
