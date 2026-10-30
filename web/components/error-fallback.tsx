"use client";

import { Button } from "@/components/ui/button";

type ErrorFallbackProps = {
  error: unknown;
  onRetry: () => void;
};

// Server Component errors reach the client with a generic message and a digest
// that matches the server logs, so the digest is the useful thing to show.
function getDigest(error: unknown) {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const digest = getDigest(error);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">This page couldn&apos;t load</h1>
          <p className="text-sm text-muted-foreground">
            Something unexpected went wrong. Try again, and if it keeps failing, check your
            connection or come back in a few minutes.
          </p>
        </div>
        {digest && (
          <p className="text-xs text-muted-foreground">
            Error reference: <code className="font-mono">{digest}</code>
          </p>
        )}
        <Button className="h-10 w-full" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </main>
  );
}
