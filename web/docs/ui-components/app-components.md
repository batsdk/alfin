# App components

Part of [UI components](index.md). These are the components this app builds on top of `components/ui/`.

## Forms (`components/form/`)

| Component | Purpose |
| --- | --- |
| `form-field.tsx` → `FormField` | Binds a React Hook Form field to a labelled field, with error and ARIA wiring |
| `text-field.tsx` → `TextField` | `FormField` + `Input` |
| `password-field.tsx` → `PasswordField` | `FormField` + input group with a show/hide toggle |

Full API: [Field components](../forms/field-components.md).

## Auth (`components/auth/`)

| Component | Purpose |
| --- | --- |
| `login-form.tsx` → `LoginForm` | Email + password login. See [Forms](../forms/index.md). |
| `signup-form.tsx` → `SignupForm` | Name, email, password sign-up |
| `auth-guard.tsx` → `AuthGuard`, `useAuthenticatedSession` | Gate for signed-in pages. See [Route protection](../security/authentication/route-protection.md). |
| `guest-guard.tsx` → `GuestGuard` | Sends signed-in users away from `/login` and `/signup` |
| `renewal-calendar.tsx` → `RenewalCalendar` | Decorative month view on the auth screens |

## Error fallback

`components/error-fallback.tsx` exports `ErrorFallback`, the "This page couldn't load" screen used by both error boundaries. For server errors it shows the error digest as a reference. See [Error boundaries](../error-handling/error-boundaries.md).

## Auth screen layout

`app/(auth)/layout.tsx` is shared by `/login` and `/signup`:

- **Left column:** the "Allfin" wordmark and the page content, centered at `max-w-sm`. Headings are left-aligned. Inputs and buttons are `h-10` for comfortable touch targets.
- **Right panel (`lg` and up only):** a muted, rounded panel holding `RenewalCalendar` and a short line about the product. Below `lg` only the form shows.

`RenewalCalendar` uses fixed sample data, not anyone's real subscriptions. It shows charges on their renewal days plus the month total. It is `aria-hidden` because it's decorative, and its chips fade in one after another once, through `motion-safe:animate-renewal-in`.

Design rules for these screens:

- Keep them minimal: neutral tokens, one accent area (the calendar).
- Use one load animation at most.
- No gradients or stock imagery.
