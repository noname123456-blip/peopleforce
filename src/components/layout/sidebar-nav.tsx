"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Dot,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { SIDEBAR_ITEMS, type SidebarItem } from "@/lib/sidebar-config";

interface SidebarNavProps {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavSection({
  item,
  role,
  pathname,
  collapsed,
  onNavClick,
}: {
  item: SidebarItem;
  role: Role;
  pathname: string;
  collapsed: boolean;
  onNavClick?: () => void;
}) {
  const visibleSubItems =
    item.subItems?.filter((s) => (s.check ? s.check(role) : true)) ?? [];
  const hasVisibleSubs = visibleSubItems.length > 0;

  const isAnySubActive = visibleSubItems.some(
    (s) => pathname === s.href || pathname.startsWith(s.href + "/"),
  );
  const isSelfActive =
    item.href &&
    (pathname === item.href || pathname.startsWith(item.href + "/"));

  const [open, setOpen] = useState(isAnySubActive);

  useEffect(() => {
    if (isAnySubActive && !open) setOpen(true);
  }, [pathname]);

  if (!item.check(role)) return null;

  // No sub-items: simple link
  if (!hasVisibleSubs && item.href) {
    return (
      <Link
        href={item.href}
        onClick={onNavClick}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
          isSelfActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  }

  // Has sub-items
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
          isAnySubActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{item.label}</span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </>
        )}
      </button>
      {!collapsed && (
        <div
          className={cn(
            "grid transition-all duration-200",
            open
              ? "mt-0.5 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="ml-3 space-y-0.5 border-l border-sidebar-border/60 pl-1">
              {visibleSubItems.map((sub) => {
                const active =
                  pathname === sub.href || pathname.startsWith(sub.href + "/");
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={onNavClick}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] transition-all duration-150",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/55 hover:text-sidebar-foreground/90 hover:bg-sidebar-accent/50",
                    )}
                  >
                    <Dot
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/30",
                      )}
                    />
                    <span className="truncate">{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({
  role,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarNavProps) {
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose?.();
  }, [pathname]);

  return (
    <aside
      className={cn(
        // Desktop: normal flow
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-all duration-300 ease-in-out",
        collapsed ? "md:w-18" : "md:w-[260px]",
        // Mobile: fixed overlay drawer
        mobileOpen &&
          "flex! fixed inset-y-0 left-0 z-50 w-[280px] animate-slide-in-left",
      )}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold shadow-sm">
            PF
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                PeopleForce
              </p>
              <p className="truncate text-[10px] text-sidebar-foreground/50">
                HR Platform
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="flex items-center justify-center size-8 rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {SIDEBAR_ITEMS.map((item) => (
          <NavSection
            key={item.label}
            item={item}
            role={role}
            pathname={pathname}
            collapsed={collapsed && !mobileOpen}
            onNavClick={mobileOpen ? onMobileClose : undefined}
          />
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden md:block border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5 mx-auto" />
          ) : (
            <>
              <PanelLeftClose className="size-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
