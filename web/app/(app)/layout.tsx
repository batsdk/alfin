import { AuthGuard } from '@/components/auth/auth-guard';

// Every page in this group requires a signed-in user
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
