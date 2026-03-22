"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className={cn("space-y-4", title || description ? "pt-2" : "")}>
          {children}
        </div>
      </div>
    );
  }
);

FormSection.displayName = "FormSection";

// Form Grid for organizing fields in columns
export interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export const FormGrid = React.forwardRef<HTMLDivElement, FormGridProps>(
  ({ cols = 2, children, className, ...props }, ref) => {
    const gridClassName = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
      <div
        ref={ref}
        className={cn("grid gap-4", gridClassName[cols], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormGrid.displayName = "FormGrid";

// Form Row for inline fields
export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ gap = "md", children, className, ...props }, ref) => {
    const gapClassName = {
      xs: "gap-2",
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-end", gapClassName[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormRow.displayName = "FormRow";

// Form Actions for submit/cancel buttons
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right" | "between";
  children: React.ReactNode;
}

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ align = "right", children, className, ...props }, ref) => {
    const alignClassName = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-4 pt-6 border-t",
          alignClassName[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormActions.displayName = "FormActions";
