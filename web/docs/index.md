# Allfin web docs

Documentation for the Allfin web app (Next.js). Start with [Architecture](architecture/index.md), then read the area you're working on. Each folder has an `index.md` with the overview, and it links to the detailed pages in that folder.

Commands, conventions and known gotchas are in [AGENTS.md](../AGENTS.md).

| Area | What it covers |
| --- | --- |
| [Architecture](architecture/index.md) | Stack, folder layout, providers, routing and rendering |
| [UI components](ui-components/index.md) | shadcn/ui, theming and the app's own components |
| [Security](security/index.md) | Security model, plus [authentication](security/authentication/index.md) and route protection |
| [State management](state-management/index.md) | What state goes where: React Query, zustand, forms, session |
| [Forms](forms/index.md) | zod + React Hook Form and the field components |
| [Error handling](error-handling/index.md) | Error boundaries, API errors and expired sessions |
| [API integration](api-integration/index.md) | Talking to the API and request tracing |

## Keeping these docs current

These pages describe the code as it is now. When you change behavior that a page covers, update that page in the same change. Refer to files by their path from `web/`, for example `lib/api.ts`.
