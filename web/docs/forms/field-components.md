# Field components

Part of [Forms](index.md). These live in `components/form/` and build on shadcn's `field.tsx`, `input.tsx` and `input-group.tsx`.

## `FormField`

`components/form/form-field.tsx`. Binds one React Hook Form field to a labelled field and wires up accessibility. It renders whatever control you give it.

| Prop | Type | Notes |
| --- | --- | --- |
| `control` | `Control<T>` | From `useForm` |
| `name` | `FieldPath<T>` | Field name, type-checked against the form values |
| `label` | `string` | Visible label |
| `description` | `string?` | Hint shown under the control while there's no error |
| `children` | `({ field, controlProps }) => ReactNode` | Renders the control |

What it handles:

- Generates an id with `useId()` and links the label to it (`htmlFor`).
- Sets `data-invalid` on the field, which turns the label and control red.
- Passes `controlProps`, `{ id, "aria-invalid", "aria-describedby" }`, for you to spread onto the control.
- Shows the description, or the validation error in its place, with `aria-describedby` pointing at whichever is visible. Errors render with `role="alert"`.

Use it directly for controls without a ready-made wrapper:

```tsx
<FormField control={control} name="billingInterval" label="Billing interval">
  {({ field, controlProps }) => (
    <select {...field} {...controlProps}>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>
  )}
</FormField>
```

## `TextField`

`components/form/text-field.tsx`. `FormField` with an `Input`. It accepts every `Input` prop except the ones the form controls (`name`, `id`, `value`, `onChange`, `onBlur`):

```tsx
<TextField
  control={control}
  name="email"
  label="Email"
  type="email"
  autoComplete="email"
  placeholder="you@example.com"
  className="h-10"
/>
```

## `PasswordField`

`components/form/password-field.tsx`. `FormField` with an input group and a show/hide button. The button keeps the label "Show password" and reports its state with `aria-pressed`. `className` sizes the outer group:

```tsx
<PasswordField
  control={control}
  name="password"
  label="Password"
  description="Use at least 10 characters."
  autoComplete="new-password"
  className="h-10"
/>
```

## Sizing

The shadcn Nova inputs default to `h-8`. The auth forms pass `className="h-10"` to fields and buttons for larger touch targets. Follow the same sizing on any form that should feel like the auth screens.
