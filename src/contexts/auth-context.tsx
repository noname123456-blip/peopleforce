"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Role } from "@/lib/types";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  canAccess: (check: (role: Role) => boolean) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role || "EMPLOYEE",
          isVerified: data.isVerified,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/user/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const hasRole = useCallback(
    (role: Role) => user?.role === role,
    [user?.role]
  );

  const canAccess = useCallback(
    (check: (role: Role) => boolean) => (user?.role ? check(user.role) : false),
    [user?.role]
  );

  const value: AuthContextValue = {
    user,
    loading,
    refetch,
    logout,
    hasRole,
    canAccess,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
