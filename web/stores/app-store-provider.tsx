"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { createAppStore, type AppStore } from "@/stores/app-store";

type AppStoreApi = ReturnType<typeof createAppStore>;

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

// One store per provider instance (i.e. per request on the server) instead of a
// module-level global, as recommended in zustand's Next.js guide.
export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createAppStore());
  return <AppStoreContext value={store}>{children}</AppStoreContext>;
}

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error("useAppStore must be used within AppStoreProvider");
  return useStore(store, selector);
}
