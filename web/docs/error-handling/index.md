# Error handling

Different failures are handled in different places. The table shows where each one ends up and what the user sees.

In this folder:

- [Error boundaries](error-boundaries.md): `app/error.tsx`, `app/global-error.tsx`, component-level boundaries
- [API errors](api-errors.md): `ApiError`, retries, toasts vs inline messages, 401

Back to [docs](../index.md).

## Where each failure goes

| What fails | Handled in | User sees |
| --- | --- | --- |
| Rendering a page throws | `app/error.tsx` | "This page couldn't load" with a Try again button |
| Rendering the root layout throws | `app/global-error.tsx` | The same screen, in its own document |
| A query (loading data) fails | React Query error state, read by the page | An inline message where the data would be |
| A mutation (changing data) fails | The mutation's `onError` in `hooks/` | A toast with the API's message |
| The API answers 401 | `redirectOnUnauthorized` in `lib/query-client.ts` | A full reload onto `/login?redirect=…` |
| Login or sign-up is rejected | The form's `onSubmit` | A toast with better-auth's message |
| Form input is invalid | zod + React Hook Form | Inline messages under the fields |

## What error boundaries don't catch

Error boundaries only catch errors thrown while rendering. They don't catch:

- errors in event handlers or `async` code;
- React Query errors, which come back as state (`isError`, `error`) because `throwOnError` isn't enabled.

Handle those where they happen, following the table above.

## Writing error messages

Say what went wrong and what the user can do next, in plain words: "Could not load subscriptions: …", "Use at least 10 characters." Don't apologize, and don't show raw JSON or stack traces. `api()` already extracts the readable message from the API's error body ([API errors](api-errors.md)).
