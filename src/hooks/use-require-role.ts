"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";

/**
 * Redirects to /dashboard if the current user's role does not pass the check.
 * Use on pages that require a specific role (e.g. HR-only pages).
 */
export function useRequireRole(check: (role: Role) => boolean) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/Login");
      return;
    }
    if (!check(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, loading, check, router]);
}
