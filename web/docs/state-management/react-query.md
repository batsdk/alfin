# React Query

Part of [State management](index.md). TanStack React Query v5 owns all data that comes from the API.

## Setup

`lib/query-client.ts` exports `getQueryClient()`, following TanStack's App Router pattern: a new client per request on the server, and one shared client in the browser. `app/providers.tsx` passes it to `QueryClientProvider`.

Defaults:

| Option | Value | Why |
| --- | --- | --- |
| `staleTime` | 60 seconds | Data isn't refetched right after it was loaded |
| `retry` | No retry for `ApiError` with status below 500, otherwise up to 3 attempts | Client errors (401, 404, validation) won't succeed on retry; network and server errors might |
| `queryCache` / `mutationCache` `onError` | `redirectOnUnauthorized` | Any 401 sends the user to log in ([Session lifecycle](../security/authentication/session-lifecycle.md#session-expiry)) |

## Hooks per resource

Each API resource gets one file in `hooks/`. `hooks/use-subscriptions.ts` is the pattern to copy:

```ts
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  list: () => [...subscriptionKeys.all, 'list'] as const,
};

export const subscriptionsQueryOptions = () =>
  queryOptions({
    queryKey: subscriptionKeys.list(),
    queryFn: () => api<Subscription[]>('/subscriptions'),
  });

export function useSubscriptions() {
  return useQuery(subscriptionsQueryOptions());
}
```

- **Key factory** (`subscriptionKeys`): every key for a resource starts with the same root, so `invalidateQueries({ queryKey: subscriptionKeys.all })` refreshes all of them.
- **`queryOptions`**: keeps the key and fetcher together and typed. The same object can be reused for `prefetchQuery` or `useSuspenseQuery`.
- **The hook**: what pages call.

## Mutations

```ts
export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Subscription['id']) => api<void>(`/subscriptions/${id}`, { method: 'DELETE' }),
    onSuccess: () => toast.success('Subscription deleted'),
    onError: (error) => toast.error(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
  });
}
```

`onSettled` returns the invalidation promise, so the mutation stays pending until the list has refetched. That keeps a button disabled until the UI is up to date. To disable only the row being deleted, compare `mutation.variables` with the row's id, as `app/(app)/subscriptions/page.tsx` does.

## Adding a resource

1. Add or extend its types in `@types/`, mirroring the API's DTOs.
2. Create `hooks/use-<resource>.ts` with a key factory, `queryOptions`, query hooks and mutation hooks.
3. Call `api()` for every request ([API client](../api-integration/api-client.md)).
4. Show query errors inline and mutation errors as toasts ([Error handling](../error-handling/api-errors.md)).

## Tooling

- **Devtools:** `ReactQueryDevtools` is mounted in `app/providers.tsx` and only included in development builds. Open it from the TanStack icon in the bottom corner to inspect queries.
- **ESLint:** `@tanstack/eslint-plugin-query` (`flat/recommended` in `eslint.config.mjs`) catches common mistakes, such as query keys missing variables the `queryFn` uses.

## Sign-out

Sign-out calls `queryClient.clear()` so cached data never outlives the session. See [Session lifecycle](../security/authentication/session-lifecycle.md#signing-out).
