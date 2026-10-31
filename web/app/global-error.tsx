"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { fontVariables } from "./fonts";
import "./globals.css";

// Catches errors in the root layout itself. It replaces that layout, so it has to
// render its own <html>/<body>, styles and fonts, and cannot export metadata.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Swap for an error reporting service (e.g. Sentry) once one is added
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <title>Something went wrong | Allfin</title>
        <ErrorFallback error={error} onRetry={retry} />
      </body>
    </html>
  );
}
