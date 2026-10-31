import { createTraceId, TRACE_ID_HEADER } from "@/lib/trace-id";

const API = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include", // required on every call, or the cookie isn't sent
    headers: {
      "content-type": "application/json",
      [TRACE_ID_HEADER]: createTraceId(),
      ...init.headers,
    },
  });
  if (!res.ok) throw new ApiError(res.status, await readErrorMessage(res));
  return res.status === 204 ? (undefined as T) : res.json();
}

// Nest errors are JSON ({ message, statusCode }) where message is a string,
// or a string[] for validation errors. Falls back to the raw body.
async function readErrorMessage(res: Response): Promise<string> {
  const body = await res.text();
  try {
    const { message } = JSON.parse(body);
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  } catch {
    // body isn't JSON
  }
  return body || res.statusText;
}
