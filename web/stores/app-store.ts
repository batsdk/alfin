import { createStore } from "zustand/vanilla";

// Client-only UI state lives here. Server data (subscriptions, categories)
// belongs in React Query, not in this store.
export type AppState = {
  // Placeholder: replace with real UI state as the app grows
  isSidebarOpen: boolean;
};

export type AppActions = {
  setSidebarOpen: (isOpen: boolean) => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
  isSidebarOpen: false,
};

export const createAppStore = (initState: AppState = defaultInitState) =>
  createStore<AppStore>()((set) => ({
    ...initState,
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  }));
