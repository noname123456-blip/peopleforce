"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  align?: "start" | "center" | "end";
  className?: string;
}

export function ActionMenu({
  items,
  align = "end",
  className,
}: ActionMenuProps) {
  // Separate destructive items to show after separator
  const normal = items.filter((i) => i.variant !== "destructive");
  const destructive = items.filter((i) => i.variant === "destructive");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
            className,
          )}
        >
          <MoreVertical className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-[160px] animate-scale-in"
      >
        {normal.map((item, i) => (
          <DropdownMenuItem
            key={i}
            onClick={item.onClick}
            disabled={item.disabled}
            className="gap-2 cursor-pointer"
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
        {destructive.length > 0 && normal.length > 0 && (
          <DropdownMenuSeparator />
        )}
        {destructive.map((item, i) => (
          <DropdownMenuItem
            key={`d-${i}`}
            onClick={item.onClick}
            disabled={item.disabled}
            className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
