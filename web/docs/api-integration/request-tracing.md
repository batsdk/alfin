# Request tracing

Part of [API integration](index.md).

Every request from the web app to the API carries an `x-tract-id` header with a UUID (v4). Each request gets its own id, including retries, so a single call can be followed through the API's logs.

## Where it's set

| File | What it does |
| --- | --- |
| `lib/trace-id.ts` | `TRACE_ID_HEADER = "x-tract-id"` and `createTraceId()` |
| `lib/api.ts` | Adds the header to every `api()` call |
| `lib/auth-client.ts` | better-auth's `onRequest` hook adds it to every auth request (session, sign-in, sign-up, sign-out) |

To rename the header, change `TRACE_ID_HEADER`. Nothing else refers to the name. (If `x-trace-id` was the intended name, that one constant is the only change.)

## Why the `uuid` package

`crypto.randomUUID()` only exists in secure contexts: HTTPS, or `localhost`. Opening the dev server through its network URL (`http://192.168.x.x:3000`, for example from a phone) is plain HTTP, where it's undefined and would break every API call. `uuid` falls back to `crypto.getRandomValues`, which works everywhere.

## CORS

A custom header makes the browser send a preflight request. The API's CORS setup currently allows any requested header. See [API integration](index.md#cookies-and-cors).

## Verified

Against a stand-in API, `GET /api/auth/get-session` and `GET /subscriptions` each arrived with their own `x-tract-id` UUID, and the browser's preflight requested `x-tract-id` as an allowed header.

## API side (not done yet)

The API doesn't read or log the header yet. A natural next step is to use it as the request id in the API's pino logger (`nestjs-pino`), falling back to a generated id when the header is missing, so every log line for a request carries the same id.
