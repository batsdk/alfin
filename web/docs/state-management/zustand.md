# zustand

Part of [State management](index.md). zustand holds client-only UI state that several components share. It never holds API data or the session.

## Pattern: one store per request

The setup follows zustand's official Next.js guide. There is no module-level global store, because on the server a global store would be shared by every request and could leak state between users.

| File | Exports |
| --- | --- |
| `stores/app-store.ts` | `AppState`, `AppActions`, `AppStore` types, `defaultInitState`, `createAppStore()` (built on `createStore` from `zustand/vanilla`) |
| `stores/app-store-provider.tsx` | `AppStoreProvider`, which creates the store once per mount, and `useAppStore(selector)` |

`AppStoreProvider` is mounted in `app/providers.tsx`, so `useAppStore` works on every page.

## Current state

The store only holds a placeholder, `isSidebarOpen` and `setSidebarOpen`. Nothing uses them yet; replace them with real UI state when it's needed.

## Reading and updating

```tsx
'use client';
import { useAppStore } from '@/stores/app-store-provider';

function SidebarToggle() {
  const isOpen = useAppStore((s) => s.isSidebarOpen);
  const setOpen = useAppStore((s) => s.setSidebarOpen);
  return <button onClick={() => setOpen(!isOpen)}>Menu</button>;
}
```

Select only what the component needs. Selecting the whole store re-renders the component on every change.

## Adding state

In `stores/app-store.ts`:

1. Add the field to `AppState` and its setter or actions to `AppActions`.
2. Add the initial value to `defaultInitState`.
3. Implement the actions in `createAppStore` with `set`.

For an unrelated concern, create a separate store and provider pair following the same pattern, and add its provider to `app/providers.tsx`.

`useAppStore` throws if it's used outside `AppStoreProvider`. That only happens in a component rendered outside the root layout, such as `app/global-error.tsx`.
