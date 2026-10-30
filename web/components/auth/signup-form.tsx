"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PasswordField } from "@/components/form/password-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { getSafeRedirect } from "@/lib/auth-routes";
import { PASSWORD_MIN_LENGTH, signupSchema, type SignupValues } from "@/lib/schemas/auth";

export function SignupForm() {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: SignupValues) {
    const { error } = await authClient.signUp.email(values);
    if (error) {
      toast.error(error.message ?? "Could not create your account");
      return;
    }
    toast.success("Account created");
    router.replace(getSafeRedirect(new URLSearchParams(window.location.search).get("redirect")));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField control={control} name="name" label="Name" autoComplete="name" className="h-10" />
        <TextField
          control={control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10"
        />
        <PasswordField
          control={control}
          name="password"
          label="Password"
          description={`Use at least ${PASSWORD_MIN_LENGTH} characters.`}
          autoComplete="new-password"
          className="h-10"
        />
        <Button type="submit" className="mt-1 h-10 w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Spinner aria-hidden data-icon="inline-start" />}
          {formState.isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
}
