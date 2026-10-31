'use client';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedSession } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteSubscription, useSubscriptions } from '@/hooks/use-subscriptions';
import { authClient } from '@/lib/auth-client';

export default function SubscriptionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedSession();
  const subscriptions = useSubscriptions();
  const deleteSubscription = useDeleteSubscription();

  function signOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Drop cached data so the next user on this browser never sees it
          queryClient.clear();
          router.replace('/login');
        },
      },
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </header>

      {subscriptions.isPending ? (
        <p className="text-muted-foreground">Loading subscriptions…</p>
      ) : subscriptions.isError ? (
        <p role="alert" className="text-destructive">
          Could not load subscriptions: {subscriptions.error.message}
        </p>
      ) : subscriptions.data.length === 0 ? (
        <p className="text-muted-foreground">No subscriptions yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {subscriptions.data.map((s) => (
            <li key={s.id}>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>
                    {s.price} {s.currency}
                  </CardDescription>
                  <CardAction>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteSubscription.isPending && deleteSubscription.variables === s.id}
                      onClick={() => deleteSubscription.mutate(s.id)}
                    >
                      Delete
                    </Button>
                  </CardAction>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
