<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Allfin web

Frontend for Allfin, a subscription tracker: people sign in and keep track of their recurring subscriptions. This folder is the Next.js app. The API it talks to lives in `../api` (NestJS + better-auth + Postgres, port 8000).

Full documentation is in [docs/index.md](docs/index.md). Read the page for the area you're changing before you change it.

## Commands

Run from `web/` unless noted.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next dev server on http://localhost:3000 |
| `pnpm dev` (repo root) | Runs the API and the web app together |
| `pnpm lint` | ESLint (Next rules plus TanStack Query rules) |
| `pnpm exec tsc --noEmit` | Type check |
| `pnpm build` | Production build; also catches server/client boundary and prerender errors |

Before calling a change done, run lint, the type check and the build.

Environment: copy `.env.sample` to `.env.local`. `NEXT_PUBLIC_API_URL` is the API base URL and is inlined into the client bundle at build time.

## Stack

- Next.js 16 App Router with `cacheComponents` and `partialPrefetching` (`next.config.ts`), Tailwind CSS v4
- UI: shadcn/ui on Radix (`components/ui/`), lucide icons, react-hot-toast
- Server state: TanStack React Query. Client UI state: zustand
- Forms: React Hook Form + zod
- Auth: better-auth client against the API, with route protection in `proxy.ts` plus client guards

## Where things go

| Path | Contents | Docs |
| --- | --- | --- |
| `app/(app)/` | Signed-in pages (guarded) | [Routing](docs/architecture/routing.md) |
| `app/(auth)/` | Log in and sign up | [Authentication](docs/security/authentication/index.md) |
| `app/error.tsx`, `app/global-error.tsx` | Error boundaries | [Error boundaries](docs/error-handling/error-boundaries.md) |
| `components/ui/` | shadcn components (generated) | [UI components](docs/ui-components/index.md) |
| `components/form/` | Form field components | [Field components](docs/forms/field-components.md) |
| `components/auth/` | Auth forms, guards, auth screen visuals | [App components](docs/ui-components/app-components.md) |
| `hooks/` | React Query hooks, one file per API resource | [React Query](docs/state-management/react-query.md) |
| `lib/` | API client, auth client, query client, schemas, route rules | [Architecture](docs/architecture/index.md) |
| `stores/` | zustand stores | [zustand](docs/state-management/zustand.md) |
| `proxy.ts` | Redirects requests without a session cookie | [Route protection](docs/security/authentication/route-protection.md) |
| `@types/` | Types mirroring the API's contracts | [API integration](docs/api-integration/index.md) |

## Conventions

- Put new signed-in pages in `app/(app)/`. Every path not listed in `PUBLIC_PATHS` (`lib/auth-routes.ts`) needs a session.
- Fetch API data through React Query hooks in `hooks/` that call `api()` from `lib/api.ts`. Don't `fetch` the API directly: `api()` and `authClient` add credentials and the `x-tract-id` header.
- Server data stays in React Query. zustand is only for client UI state.
- Forms: a zod schema in `lib/schemas/`, `useForm` with `zodResolver`, and fields from `components/form/`.
- Add shadcn components with `pnpm dlx shadcn@latest add <name>`. Wrap or compose them instead of editing `components/ui/*`, so they can still be updated.
- Read query params from `window.location.search` inside event handlers or effects. `useSearchParams` on a static page needs a Suspense boundary under `cacheComponents`.
- Use the semantic color tokens (`bg-background`, `text-muted-foreground`, `text-destructive`, …) rather than raw colors.
- Import with the `@/*` alias, which maps to `web/`.

## Gotchas

- After moving or renaming a route, `tsc` reports errors in `.next/types/validator.ts`. Those are stale generated types; `pnpm build` regenerates them.
- `next dev` can miss edits made while `node_modules` is changing (for example during `shadcn add`) and keep serving old server HTML. It shows up as hydration mismatches; restart the dev server.
- If a dev server is already running for this folder, `next dev` refuses to start another. Reuse it; `.next/dev/lock` has its URL and PID.
- `crypto.randomUUID()` only exists in secure contexts, so it throws on the dev server's plain-http network URL. Use the `uuid` package, as `lib/trace-id.ts` does.
- `proxy.ts` reads the session cookie that the API sets. In production that only works if the web app and the API share a parent domain with cross-subdomain cookies. See [Route protection](docs/security/authentication/route-protection.md).
- `pnpm-workspace.yaml` holds pnpm's `allowBuilds` list. Without it, pnpm may refuse or skip dependency build scripts.
