'use client';

import { useEffect } from 'react';
import { ErrorFallback } from '@/components/error-fallback';

// Catches errors thrown while rendering any page. Renders inside the root layout,
// so providers and styles are still available.
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Swap for an error reporting service (e.g. Sentry) once one is added
    console.error(error);
  }, [error]);

  return <ErrorFallback error={error} onRetry={retry} />;
}
