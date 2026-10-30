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
    headers: { "content-type": "application/json", ...init.headers },
  });
  if (!res.ok)
    throw new ApiError(res.status, (await res.text()) || res.statusText);
  return res.status === 204 ? (undefined as T) : res.json();
}
