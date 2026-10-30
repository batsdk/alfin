import { cn } from "@/lib/utils";

type SampleRenewal = {
  day: number;
  amount: number;
  className: string;
};

// Illustrative renewals for the sign-in screen, not anyone's real data
const RENEWALS: SampleRenewal[] = [
  { day: 3, amount: 29, className: "bg-teal-500/15 text-teal-800 dark:text-teal-300" },
  { day: 7, amount: 10.99, className: "bg-rose-500/15 text-rose-800 dark:text-rose-300" },
  { day: 12, amount: 2.99, className: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300" },
  { day: 18, amount: 15.49, className: "bg-amber-500/20 text-amber-900 dark:text-amber-300" },
  { day: 24, amount: 8, className: "bg-violet-500/15 text-violet-800 dark:text-violet-300" },
  { day: 28, amount: 12, className: "bg-sky-500/15 text-sky-800 dark:text-sky-300" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_IN_MONTH = 30;
const LEADING_BLANKS = 2; // the sample month starts on a Wednesday

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const monthlyTotal = RENEWALS.reduce((sum, renewal) => sum + renewal.amount, 0);

// Decorative month view showing subscription charges on the days they renew.
export function RenewalCalendar({ className }: { className?: string }) {
  const renewalsByDay = new Map(RENEWALS.map((renewal, order) => [renewal.day, { ...renewal, order }]));

  return (
    <div
      aria-hidden
      className={cn("rounded-xl bg-background p-5 shadow-xs ring-1 ring-foreground/5", className)}
    >
      <div className="mb-5 flex items-baseline justify-between text-sm font-medium">
        <p>This month</p>
        <p className="tabular-nums">{currency.format(monthlyTotal)}</p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="px-1 pb-2 text-muted-foreground">
            {weekday}
          </div>
        ))}

        {Array.from({ length: LEADING_BLANKS }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
          const day = i + 1;
          const renewal = renewalsByDay.get(day);

          return (
            <div key={day} className="flex h-14 flex-col gap-1 p-1">
              <span className={renewal ? "font-medium" : "text-muted-foreground"}>{day}</span>
              {renewal && (
                <span
                  className={cn(
                    "rounded-[5px] px-1 py-0.5 text-[11px] leading-none font-medium tabular-nums motion-safe:animate-renewal-in",
                    renewal.className,
                  )}
                  style={{ animationDelay: `${250 + renewal.order * 110}ms` }}
                >
                  {renewal.amount.toFixed(2)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
