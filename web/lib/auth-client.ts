import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // talks to /api/auth/* on your Nest app
  fetchOptions: { credentials: "include" }, // send/receive the session cookie cross-origin
});
