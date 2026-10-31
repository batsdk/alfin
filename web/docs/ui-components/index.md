# UI components

The UI is built from shadcn/ui components on Radix primitives, styled with Tailwind CSS v4 and theme tokens. The app's own components compose them.

In this folder:

- [Theming](theming.md): color tokens, dark mode, fonts, animations
- [App components](app-components.md): the components this app adds on top of shadcn

Back to [docs](../index.md).

## shadcn/ui setup

shadcn copies component source into `components/ui/`, so the code lives in this repo rather than in a package. The setup is in `components.json`:

| Setting | Value |
| --- | --- |
| Style | `radix-nova` (Radix primitives, Nova preset) |
| Base color | neutral, with CSS variables |
| Icons | `lucide-react` |
| Class merging | the `cn` package, shadcn's replacement for `clsx` + `tailwind-merge`. Generated components import it from `"cn"`; `lib/utils.ts` re-exports it. |

Radix primitives come from the single `radix-ui` package (for example `import { Slot } from "radix-ui"` in `components/ui/button.tsx`).

## Components in `components/ui/`

| Component | Used for |
| --- | --- |
| `button.tsx` | Buttons (`variant`: default, outline, secondary, ghost, destructive, link; `size`: xs to lg, icon sizes) |
| `card.tsx` | Subscription rows |
| `field.tsx` | Form field layout: `Field`, `FieldLabel`, `FieldError`, `FieldDescription`, `FieldGroup` |
| `input.tsx` | Text inputs |
| `input-group.tsx` | Inputs with add-ons (the password show/hide button) |
| `label.tsx` | Used by `field.tsx` |
| `separator.tsx` | Used by `field.tsx` |
| `spinner.tsx` | Loading indicator |
| `tabs.tsx` | Currently unused |
| `textarea.tsx` | Added as a dependency of `input-group.tsx`; currently unused |

## Adding a component

From `web/`:

```bash
pnpm dlx shadcn@latest add dialog
```

The CLI skips files that already exist unless you pass `--overwrite`.

## Rules

- **Don't rewrite `components/ui/*`.** Wrap or compose those components in `components/<area>/` instead, so `shadcn add --overwrite` can still update them. Small fixes are fine; note them in the commit.
- **Use the variants first** (`variant`, `size`), then `className` for one-off layout.
- **Use theme tokens** (`bg-background`, `text-muted-foreground`, `border-border`, …), not raw colors. See [Theming](theming.md).
- **Icons:** import from `lucide-react`, for example `import { EyeIcon } from "lucide-react"`.

## Toasts

Toasts use `react-hot-toast`, not shadcn's Sonner. `<Toaster position="top-right">` is mounted in `app/providers.tsx` and styled with the popover tokens. Call it from anywhere:

```ts
import toast from 'react-hot-toast';

toast.success('Subscription deleted');
toast.error(error.message);
```

Which errors become toasts is covered in [Error handling](../error-handling/index.md).

## Accessibility

- Every input has a visible label (`FieldLabel`), and validation errors are linked to it through `aria-describedby` ([Field components](../forms/field-components.md)).
- Focus rings come from the shadcn components; don't remove `outline` or `ring` styles.
- Toggle buttons use `aria-pressed` (the password visibility button).
- Purely decorative visuals use `aria-hidden` (the renewal calendar).
- Motion is wrapped in `motion-safe:` so it respects reduced-motion settings.
