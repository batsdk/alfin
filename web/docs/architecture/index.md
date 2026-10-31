# Architecture

The web app is a Next.js 16 App Router frontend for the Allfin API. Pages render in the browser and fetch data from the API with the user's session cookie. No Server Component calls the API yet.

In this folder:

- [Routing](routing.md): route groups, which pages are public, how to add a page
- [Rendering](rendering.md): Cache Components, server vs client components, fonts

Back to [docs](../index.md).

## Stack

| Concern | Library | Notes |
| --- | --- | --- |
| Framework | `next` 16.4, `react` 19.3 | App Router, `cacheComponents`, `partialPrefetching` |
| Styling | Tailwind CSS v4 | Loaded through `@tailwindcss/turbopack` in `next.config.ts` |
| UI primitives | shadcn/ui on `radix-ui` | See [UI components](../ui-components/index.md) |
| Server state | `@tanstack/react-query` 5 | See [React Query](../state-management/react-query.md) |
| Client state | `zustand` 5 | See [zustand](../state-management/zustand.md) |
| Forms | `react-hook-form` 7, `zod` 4, `@hookform/resolvers` 6 | See [Forms](../forms/index.md) |
| Auth | `better-auth` 1.7 (client) | See [Authentication](../security/authentication/index.md) |
| Toasts | `react-hot-toast` 2 | `<Toaster>` in `app/providers.tsx` |
| Request ids | `uuid` 14 | See [Request tracing](../api-integration/request-tracing.md) |

## Folder layout

```
web/
  app/
    (app)/            signed-in pages, wrapped in AuthGuard
    (auth)/           /login and /signup, wrapped in GuestGuard
    error.tsx         error boundary for pages
    global-error.tsx  error boundary for the root layout
    fonts.ts          Geist font setup, shared by layout and global-error
    globals.css       Tailwind, theme tokens, animations
    layout.tsx        root layout: fonts, metadata, Providers
    providers.tsx     client providers (React Query, zustand, toasts)
  components/
    ui/               shadcn components (generated)
    form/             form field components
    auth/             auth forms, guards, auth screen visuals
    error-fallback.tsx
  hooks/              React Query hooks per API resource
  lib/                api client, auth client, query client, schemas, route rules
  stores/             zustand stores
  @types/             types mirroring the API's contracts
  proxy.ts            redirects requests without a session cookie
```

## Provider tree

`app/layout.tsx` wraps every page in `Providers` from `app/providers.tsx`:

```
QueryClientProvider        client from getQueryClient() in lib/query-client.ts
├─ AppStoreProvider        zustand store, stores/app-store-provider.tsx
│  └─ page
├─ Toaster                 react-hot-toast
└─ ReactQueryDevtools      only included in development builds
```

## How a request flows

```
Browser (web, :3000)                                        API (:8000)
  proxy.ts            checks the session cookie exists
  page → hook in hooks/ → api()  ── fetch, credentials, x-tract-id ──▶  Nest controllers
  authClient (better-auth)       ── fetch, credentials, x-tract-id ──▶  /api/auth/*
```

1. `proxy.ts` runs before every page request and sends requests without a session cookie to `/login`.
2. The page renders. In `app/(app)/`, `AuthGuard` asks the API whether the session is valid before showing anything.
3. Pages read data through React Query hooks, which call `api()` from `lib/api.ts`.
4. The API checks the session on every protected endpoint and answers 401 without one.

## Environment

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `lib/api.ts`, `lib/auth-client.ts` | API base URL, e.g. `http://localhost:8000`. Inlined into client code at build time, so rebuild after changing it. |

`.env.sample` lists the variables. Put local values in `.env.local`.
