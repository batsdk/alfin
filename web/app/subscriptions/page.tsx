'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api';
import { Subscription } from '@/@types/subscriptions.types';

export default function SubscriptionsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    if (isPending) return;
    if (!session) return router.replace('/login');

    api<Subscription[]>('/subscriptions')
      .then(setSubs)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) router.replace('/login');
      });
  }, [session, isPending, router]);

  if (isPending) return <p>Loading…</p>;

  return (
    <main>
      <p>Signed in as {session?.user.email}</p>
      <button
        onClick={() =>
          authClient.signOut({ fetchOptions: { onSuccess: () => router.push('/login') } })
        }
      >
        Sign out
      </button>

      <ul>
        {subs.map((s) => (
          <li key={s.id}>
            {s.title}: {(s.price / 100).toFixed(2)} {s.currency}
          </li>
        ))}
      </ul>
    </main>
  );
}