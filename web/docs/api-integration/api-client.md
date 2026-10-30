# API client

Part of [API integration](index.md).

## `api<T>(path, init?)`

`lib/api.ts`. A thin wrapper around `fetch`:

- Prefixes `path` with `NEXT_PUBLIC_API_URL`.
- Sends cookies (`credentials: "include"`).
- Sets `content-type: application/json` and a fresh `x-tract-id` ([Request tracing](request-tracing.md)). Headers in `init.headers` are applied last, so a caller can override either one.
- Throws `ApiError` on a non-2xx response ([API errors](../error-handling/api-errors.md)).
- Returns `undefined` for 204 No Content, and the parsed JSON body for anything else.

```ts
const subscriptions = await api<Subscription[]>('/subscriptions');
await api<void>(`/subscriptions/${id}`, { method: 'DELETE' });
await api<CreatedThing>('/things', { method: 'POST', body: JSON.stringify(values) });
```

`T` is a type assertion, not a runtime check. Match it to what the controller actually returns. Some endpoints wrap their result; `POST /subscriptions`, for example, returns `{ isSuccess, subscription }`.

## Use it through hooks

Pages and components don't call `api()` directly. Each resource has a hook file in `hooks/` that wraps `api()` in React Query, which gives caching, retries, the global 401 handling and consistent error toasts.

Adding a hook for an existing endpoint, using categories as the example:

```ts
// hooks/use-categories.ts
export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: categoryKeys.list(),
    queryFn: () => api<Category[]>('/category'),
  });

export function useCategories() {
  return useQuery(categoriesQueryOptions());
}
```

Then add the `Category` type to `@types/`, mirroring `../api/src/category/category.entity.ts`. The full pattern, including mutations, is in [React Query](../state-management/react-query.md).

## Don't

- Don't call `fetch` on the API directly. You'd lose credentials, the trace header and `ApiError`.
- Don't call `api()` from Server Components. The session cookie belongs to the user's browser session with the API, and server-side calls aren't set up to forward it.
