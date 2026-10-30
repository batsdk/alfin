import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Log in to Allfin</h1>
        <p className="text-sm text-muted-foreground">Enter your email and password to continue.</p>
      </div>
      <LoginForm />
      <p className="mt-6 text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
