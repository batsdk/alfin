"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { getQueryClient } from "@/lib/query-client";
import { AppStoreProvider } from "@/stores/app-store-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider>{children}</AppStoreProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm ring-1 ring-foreground/10",
          style: {
            background: "var(--popover)",
            color: "var(--popover-foreground)",
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
