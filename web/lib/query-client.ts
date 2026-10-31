import { isServer, MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { loginUrl } from "@/lib/auth-routes";

const MAX_RETRIES = 3;

// The session expired or was revoked while the app was open. A full page load rather
// than a client-side navigation also clears React Query, zustand and better-auth's
// cached session, so nothing from the old session survives.
function redirectOnUnauthorized(error: Error) {
  if (isServer || !(error instanceof ApiError) || error.status !== 401) return;
  window.location.replace(loginUrl(window.location.pathname + window.location.search));
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: redirectOnUnauthorized }),
    mutationCache: new MutationCache({ onError: redirectOnUnauthorized }),
    defaultOptions: {
      queries: {
        // Above 0 so data rendered on the server isn't refetched immediately on the client
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Client errors (401, 404, validation) won't succeed on retry
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < MAX_RETRIES;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// Server: a fresh client per request so data never leaks between users.
// Browser: one shared client, so it survives React suspending during the initial render.
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
