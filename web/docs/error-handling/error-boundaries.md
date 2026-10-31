# Error boundaries

Part of [Error handling](index.md). These use the Next.js 16.3+ API; read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md` before changing them.

## `app/error.tsx`

Catches errors thrown while rendering any page. It renders inside the root layout, so providers, styles and toasts still work.

```tsx
'use client';

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error); // swap for an error reporting service
  }, [error]);

  return <ErrorFallback error={error} onRetry={retry} />;
}
```

## `app/global-error.tsx`

Catches errors in the root layout itself. It replaces the layout, so it has to render its own `<html>` and `<body>`, import `./globals.css`, and apply `fontVariables` from `app/fonts.ts`. It can't export `metadata`, so it sets the tab title with a React `<title>` element. Providers aren't available there, so don't use `useAppStore`, React Query or toasts inside it.

## Props in Next 16.3+

- **`retry()`** re-fetches and re-renders the boundary's contents. Use it for "Try again".
- **`reset()`** only clears the error state without re-fetching, so it won't recover from Server Component errors. Avoid it unless you need exactly that.
- **`error` is `unknown`.** A value thrown in a client component may not be an `Error`. Narrow it with `instanceof Error` before reading `message` or `digest`.

## `ErrorFallback`

`components/error-fallback.tsx` is shared by both boundaries. It shows a short explanation and a Try again button. For Server Component errors it also shows `error.digest` as an "Error reference": in production Next replaces the real message with a generic one, and the digest matches the server logs.

## Component-level boundaries

To keep part of a page working when another part fails, use `catchError` from `next/error` instead of a hand-written React error boundary. It works with `redirect()` and `notFound()`, and clears itself on navigation:

```tsx
'use client';
import { catchError, type ErrorInfo } from 'next/error';

function SectionError(props: { title: string }, { retry }: ErrorInfo) {
  return (
    <div>
      <p>{props.title} couldn't load.</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  );
}

export default catchError(SectionError);
```

Nothing in the app uses it yet.

## Reporting

Both boundaries only `console.error` the error. When an error reporting service such as Sentry is added, call it from the same `useEffect` in both files.

## Testing a boundary

Add a temporary client page that throws after a click, so the build doesn't fail during prerendering. Click it, check the fallback, press Try again, then delete the page:

```tsx
'use client';
export default function ErrorTestPage() {
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) throw new Error('Test error');
  return <button onClick={() => setShouldThrow(true)}>Throw</button>;
}
```

`app/error.tsx` was verified this way: the fallback rendered and Try again recovered the page. `app/global-error.tsx` has only been built, not triggered.
