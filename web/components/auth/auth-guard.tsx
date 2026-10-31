'use client';

import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { loginUrl } from '@/lib/auth-routes';

type AuthenticatedSession = typeof authClient.$Infer.Session;

const AuthenticatedSessionContext = createContext<AuthenticatedSession | null>(null);

// Source of truth for app pages: proxy.ts only checks that a cookie exists, while this
// asks the API whether the session is valid. Children render only with a session.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(loginUrl(window.location.pathname + window.location.search));
    }
  }, [isPending, session, router]);

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return <AuthenticatedSessionContext value={session}>{children}</AuthenticatedSessionContext>;
}

// The current session inside AuthGuard, typed as always present
export function useAuthenticatedSession() {
  const session = useContext(AuthenticatedSessionContext);
  if (!session) throw new Error('useAuthenticatedSession must be used within AuthGuard');
  return session;
}
