import { GuestGuard } from '@/components/auth/guest-guard';
import { RenewalCalendar } from '@/components/auth/renewal-calendar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <div className="flex flex-col gap-10 p-6 md:p-10">
        <p className="text-base font-semibold tracking-tight">Allfin</p>
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <GuestGuard>{children}</GuestGuard>
          </div>
        </main>
      </div>

      <aside className="m-3 hidden flex-col gap-10 rounded-2xl bg-muted p-10 lg:flex">
        <div className="flex flex-1 items-center justify-center">
          <RenewalCalendar className="w-full max-w-md" />
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <p className="text-2xl font-semibold tracking-tight text-balance">
            Know what you pay for, and when it renews.
          </p>
          <p className="text-sm text-pretty text-muted-foreground">
            Allfin keeps every subscription in one list, with its price and billing cycle.
          </p>
        </div>
      </aside>
    </div>
  );
}
