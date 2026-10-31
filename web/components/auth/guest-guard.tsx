'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { getSafeRedirect } from '@/lib/auth-routes';

// Sends signed-in users away from /login and /signup. Children render straight away
// so logged-out users never wait on the session check to see the form.
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace(getSafeRedirect(new URLSearchParams(window.location.search).get('redirect')));
    }
  }, [session, router]);

  return children;
}
