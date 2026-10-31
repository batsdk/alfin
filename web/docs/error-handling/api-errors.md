# API errors

Part of [Error handling](index.md).

## `ApiError`

`api()` in `lib/api.ts` throws `ApiError` for any non-2xx response:

```ts
export class ApiError extends Error {
  constructor(public status: number, message: string) { … }
}
```

The message is made readable from the response body:

- Nest error bodies are JSON (`{ message, statusCode }`). If `message` is a string, it's used as is.
- For validation errors, `message` is a `string[]`, and the entries are joined with ", ".
- If the body isn't JSON, the raw body is used, or the HTTP status text when the body is empty.

So `error.message` can go straight into a toast or inline message.

Network failures (API down, CORS rejected) throw a plain `TypeError` from `fetch`, not an `ApiError`.

## Retries

The query client's `retry` option (`lib/query-client.ts`):

| Error | Retried? |
| --- | --- |
| `ApiError` with status below 500 (400, 401, 404, …) | No, it won't succeed on retry |
| `ApiError` with status 500 or above | Up to 3 attempts |
| Anything else (network errors) | Up to 3 attempts |

Mutations aren't retried; that's React Query's default.

## Showing errors

**Queries:** render the error state inline, where the data would have been. From `app/(app)/subscriptions/page.tsx`:

```tsx
subscriptions.isError ? (
  <p role="alert" className="text-destructive">
    Could not load subscriptions: {subscriptions.error.message}
  </p>
) : …
```

**Mutations:** toast from the hook's `onError`, so every caller gets the same behavior. From `hooks/use-subscriptions.ts`:

```ts
onError: (error) => toast.error(error.message),
```

**better-auth calls** return `{ error }` instead of throwing. Toast `error.message` with a fallback ([Authentication](../security/authentication/index.md#flows)).

## 401 Unauthorized

Every query and mutation passes its errors to `redirectOnUnauthorized` (`lib/query-client.ts`). On an `ApiError` with status 401 it does a full page load onto `/login?redirect=<current page>`. Individual hooks and pages don't need their own 401 handling. Details: [Session lifecycle](../security/authentication/session-lifecycle.md#session-expiry).
