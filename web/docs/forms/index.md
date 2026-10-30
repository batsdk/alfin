# Forms

Forms use React Hook Form for state, zod for validation, and the field components in `components/form/` for markup and accessibility.

In this folder:

- [Field components](field-components.md): `FormField`, `TextField` and `PasswordField`

Back to [docs](../index.md).

## How a form fits together

1. **A zod schema** in `lib/schemas/` describes the values and their error messages.
2. **`useForm`** with `zodResolver(schema)` and `defaultValues` for every field.
3. **Field components** bound with `control` and `name`.
4. **Submit:** `handleSubmit(onSubmit)` only calls `onSubmit` once the values pass the schema. Server errors become toasts.

`components/auth/login-form.tsx` is the reference:

```tsx
const { control, handleSubmit, formState } = useForm<LoginValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
});

async function onSubmit(values: LoginValues) {
  const { error } = await authClient.signIn.email(values);
  if (error) {
    toast.error(error.message ?? 'Could not log in');
    return;
  }
  router.replace(getSafeRedirect(new URLSearchParams(window.location.search).get('redirect')));
}

return (
  <form onSubmit={handleSubmit(onSubmit)} noValidate>
    <FieldGroup>
      <TextField control={control} name="email" label="Email" type="email" autoComplete="email" />
      <PasswordField control={control} name="password" label="Password" autoComplete="current-password" />
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Spinner aria-hidden data-icon="inline-start" />}
        {formState.isSubmitting ? 'Logging in…' : 'Log in'}
      </Button>
    </FieldGroup>
  </form>
);
```

## Schemas

`lib/schemas/auth.ts`:

```ts
export const PASSWORD_MIN_LENGTH = 10; // keep in sync with the API

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'Name is required'),
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export type LoginValues = z.infer<typeof loginSchema>;
```

- **This is zod 4:** use the top-level formats (`z.email()`), not `z.string().email()`.
- **Mirror the API's rules for fast feedback.** `PASSWORD_MIN_LENGTH` matches `minPasswordLength` in `../api/src/auth/auth.ts`. The API still validates everything again.
- **Login only requires a password to be present.** The length policy belongs to sign-up, and existing accounts shouldn't be rejected if the policy changes.
- **Export the inferred types** (`LoginValues`, `SignupValues`) and use them for `useForm` and `onSubmit`.

## Conventions

- Put `noValidate` on `<form>` so zod's messages show instead of the browser's validation bubbles.
- Give every field a default value, so inputs are controlled from the first render.
- Use `formState.isSubmitting` for the pending state: disable the button, show a `Spinner` and a present-tense label ("Logging in…").
- **Validation errors** show inline under the field. **Server errors** (wrong password, API down) show as `toast.error`.
- Set `autoComplete` on inputs (`email`, `current-password`, `new-password`, `name`) so password managers work.

## Adding a form

1. Write the schema and its inferred type in `lib/schemas/<area>.ts`.
2. Create the form component in `components/<area>/`, marked `'use client'`.
3. Call `useForm` with `zodResolver` and `defaultValues`.
4. Render the fields with `TextField` or `PasswordField`, or `FormField` for any other control ([Field components](field-components.md)).
5. In `onSubmit`, call a React Query mutation (or `authClient`), toast server errors, and navigate or reset on success.
