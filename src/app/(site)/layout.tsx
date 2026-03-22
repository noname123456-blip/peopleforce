import { AuthProvider } from "@/contexts/auth-context";
import { AppShell } from "@/components/layout/app-shell";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
