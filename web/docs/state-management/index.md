# State management

Each kind of state has one home. Picking the right one avoids duplicate caches and stale copies.

In this folder:

- [React Query](react-query.md): data from the API
- [zustand](zustand.md): client-only UI state

Back to [docs](../index.md).

## What goes where

| State | Tool | Where it lives |
| --- | --- | --- |
| Data from the API (subscriptions, categories, …) | React Query | Hooks in `hooks/`, client in `lib/query-client.ts` |
| The signed-in user and session | better-auth | `authClient.useSession()` / `useAuthenticatedSession()` ([Authentication](../security/authentication/index.md)) |
| Form input and validation | React Hook Form + zod | `components/form/`, `lib/schemas/` ([Forms](../forms/index.md)) |
| UI state shared across components (sidebar open, selected filters) | zustand | `stores/` |
| UI state used by one component | `useState` | The component |
| View state worth sharing or bookmarking (filters, tabs) | URL query params | Read via `window.location` in handlers and effects ([Rendering](../architecture/rendering.md#query-params-and-window)) |

## Rules

- **Never copy API data into zustand or `useState`.** Read it from the React Query hook wherever you need it; the cache keeps every reader in sync.
- **Never store the session in zustand.** better-auth already shares it across components.
- **After a mutation, invalidate the related queries** instead of editing a local copy. See [React Query](react-query.md#mutations).
- **Keep zustand selectors narrow** (`useAppStore((s) => s.isSidebarOpen)`) so components only re-render when their slice changes.
