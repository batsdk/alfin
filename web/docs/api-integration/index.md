# API integration

The web app talks to the Allfin API (`../api`, NestJS) over HTTP. In development the API runs on `http://localhost:8000` and the web app on `http://localhost:3000`.

In this folder:

- [API client](api-client.md): using `api()` and adding hooks for new endpoints
- [Request tracing](request-tracing.md): the `x-tract-id` header

Back to [docs](../index.md).

## Two clients

| Client | File | Used for |
| --- | --- | --- |
| `api()` | `lib/api.ts` | The app's own endpoints (`/subscriptions`, …), always called through React Query hooks in `hooks/` |
| `authClient` | `lib/auth-client.ts` | better-auth endpoints under `/api/auth/*`: sign up, log in, sign out, session |

Both read the base URL from `NEXT_PUBLIC_API_URL`, send cookies with `credentials: "include"`, and add an `x-tract-id` header to every request.

## Cookies and CORS

The API and the web app are different origins, so:

- **Credentials:** every request needs `credentials: "include"`, or the session cookie isn't sent. Both clients set it; don't call `fetch` on the API yourself.
- **CORS:** the API allows only `WEB_ORIGIN` with credentials (`app.enableCors({ origin: process.env.WEB_ORIGIN, credentials: true })` in `../api/src/main.ts`). `WEB_ORIGIN` must exactly match the web app's origin, port included.
- **Preflight:** the JSON `content-type` and the `x-tract-id` header make the browser send a preflight `OPTIONS` request first. Nest's CORS setup allows the requested headers because it doesn't restrict `allowedHeaders`. If the API ever adds that restriction, it must list `content-type` and `x-tract-id`.

## Endpoints used so far

| Method and path | Used by |
| --- | --- |
| `GET /subscriptions` | `useSubscriptions()` in `hooks/use-subscriptions.ts` |
| `DELETE /subscriptions/:id` | `useDeleteSubscription()` |
| `/api/auth/*` | `authClient` |

The API also has `POST /subscriptions`, `GET /category` and `POST /category`, which the web app doesn't use yet. The controllers are in `../api/src/subscriptions/` and `../api/src/category/`.

## Types

`@types/subscriptions.types.ts` mirrors the API's subscription shape and its `BillingInterval` enum (`../api/src/contracts/subscriptions.types.ts`). They're kept in sync by hand: when an API DTO changes, update the matching type here.
