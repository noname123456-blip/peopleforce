"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Search,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  HR_MANAGER: "HR Manager",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map(
      (seg) => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    );

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">PeopleForce</span>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-muted-foreground/40">&rsaquo;</span>
          <span
            className={cn(
              i === segments.length - 1 ? "font-medium text-foreground" : "",
            )}
          >
            {seg}
          </span>
        </span>
      ))}
    </div>
  );
}

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/Login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 md:hidden text-muted-foreground"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Mobile brand */}
        <span className="text-sm font-semibold text-foreground sm:hidden">
          PeopleForce
        </span>

        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-0.5">
        {/* Search - hidden on very small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hidden sm:inline-flex"
        >
          <Search className="size-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 text-muted-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        </Button>

        {/* Settings - hidden on small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hidden sm:inline-flex"
        >
          <Settings className="size-4" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Divider */}
        <div className="mx-1.5 h-6 w-px bg-border hidden sm:block" />

        {/* User dropdown */}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() || (
                <User className="size-3.5" />
              )}
            </span>
            <span className="hidden lg:flex lg:flex-col lg:items-start">
              <span className="max-w-[120px] truncate text-[13px] font-medium text-foreground">
                {user?.username || user?.email}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {ROLE_LABELS[user?.role || ""] || user?.role}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform hidden lg:block",
                open && "rotate-180",
              )}
            />
          </button>
          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-scale-in">
              {user && (
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-semibold">
                    {user.username || user.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <span className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>
              )}
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  router.push("/profile");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <User className="size-4" />
                My Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/settings");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <Settings className="size-4" />
                Settings
              </button>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
