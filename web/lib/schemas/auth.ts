import { z } from "zod";

// Keep in sync with emailAndPassword.minPasswordLength in api/src/auth/auth.ts
export const PASSWORD_MIN_LENGTH = 10;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  // Only the sign-up form enforces the length policy; login just needs a value
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Name is required"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
