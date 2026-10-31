# Theming

Part of [UI components](index.md).

All theme values live in `app/globals.css`.

## Color tokens

`:root` (light) and `.dark` define CSS variables in `oklch`. The `@theme inline` block maps them to Tailwind utilities:

| Token | Utilities | Used for |
| --- | --- | --- |
| `--background` / `--foreground` | `bg-background`, `text-foreground` | Page background and text |
| `--muted` / `--muted-foreground` | `bg-muted`, `text-muted-foreground` | Panels, secondary text |
| `--primary` / `--primary-foreground` | `bg-primary`, `text-primary-foreground` | Primary buttons |
| `--card`, `--popover` (+ `-foreground`) | `bg-card`, `bg-popover`, … | Cards, toasts |
| `--destructive` | `text-destructive`, `bg-destructive/10` | Errors, delete buttons |
| `--border`, `--input`, `--ring` | `border-border`, `border-input`, `ring-ring` | Borders and focus rings |
| `--chart-1` … `--chart-5`, `--sidebar-*` | `bg-chart-1`, `bg-sidebar`, … | Reserved for charts and a sidebar |

`--radius` (0.625rem) drives `rounded-sm` through `rounded-4xl`.

To change the palette, edit the variables in `:root` and `.dark`; components pick up the change automatically.

## Dark mode

Dark mode is class-based (`@custom-variant dark (&:is(.dark *))`), so it applies when an ancestor has the `dark` class. Nothing sets that class yet, so the app is light-only. Adding a theme toggle means putting `dark` on `<html>` (for example with `next-themes`). `app/global-error.tsx` renders its own `<html>` and would need the class too.

## Fonts

`app/fonts.ts` loads Geist and Geist Mono with `next/font` and sets the `--font-sans` and `--font-geist-mono` variables on `<html>`. In `globals.css`, `--font-sans`, `--font-heading` and `--font-mono` point at those variables, and `html` gets `font-sans`.

`--font-sans: var(--font-sans)` in `@theme inline` looks circular, but it works: next/font's class sets the variable in unlayered CSS, which wins over the theme layer.

## Animations

- `tw-animate-css` (imported in `globals.css`) provides `animate-in`, `fade-in`, `zoom-in-*` and the related utilities.
- `animate-renewal-in` is defined in the `@theme` block of `globals.css` (fade and rise, 480 ms). The renewal calendar uses it with a per-item `animationDelay`.

Always prefix non-essential motion with `motion-safe:` (for example `motion-safe:animate-renewal-in`) so it's skipped when the OS asks for reduced motion.

## Exceptions to the token rule

The sample chips in `components/auth/renewal-calendar.tsx` use Tailwind palette tints (`bg-teal-500/15 text-teal-800`, …) to stand in for subscription colors. Real subscription colors will come from the API's `color` field.
