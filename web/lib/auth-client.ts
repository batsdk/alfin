import { createAuthClient } from "better-auth/react";
import { createTraceId, TRACE_ID_HEADER } from "@/lib/trace-id";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // talks to /api/auth/* on your Nest app
  fetchOptions: {
    credentials: "include", // send/receive the session cookie cross-origin
    onRequest: (context) => {
      context.headers.set(TRACE_ID_HEADER, createTraceId());
    },
  },
});
