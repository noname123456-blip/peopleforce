"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, required, hint, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2 w-full", className)} {...props}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {children}

        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}

        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// Preset field components for common input types
export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, hint, ...props }, ref) => {
    return (
      <FormField label={label} error={error} required={required} hint={hint}>
        <Input ref={ref} {...props} />
      </FormField>
    );
  }
);

FormInput.displayName = "FormInput";

// Form Textarea
export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ label, error, required, hint, ...props }, ref) => {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Textarea ref={ref} {...props} />
    </FormField>
  );
});

FormTextarea.displayName = "FormTextarea";

// Form Select
export interface FormSelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      error,
      required,
      hint,
      value,
      onValueChange,
      placeholder,
      options,
      disabled,
    },
    ref
  ) => {
    return (
      <FormField label={label} error={error} required={required} hint={hint}>
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger ref={ref}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    );
  }
);

FormSelect.displayName = "FormSelect";

// Form Checkbox
export interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const FormCheckbox = React.forwardRef<
  HTMLInputElement,
  FormCheckboxProps
>(
  (
    { label, error, hint, className, containerClassName, ...props },
    ref
  ) => {
    return (
      <FormField
        label={label}
        error={error}
        hint={hint}
        className={containerClassName}
      >
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-input bg-background cursor-pointer",
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

// Form Radio Group
export interface FormRadioGroupProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
}

export const FormRadioGroup = React.forwardRef<
  HTMLDivElement,
  FormRadioGroupProps
>(
  (
    {
      label,
      error,
      required,
      hint,
      value,
      onValueChange,
      options,
      disabled,
    },
    ref
  ) => {
    return (
      <FormField
        ref={ref}
        label={label}
        error={error}
        required={required}
        hint={hint}
      >
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                id={option.value}
                name={label}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onValueChange(e.target.value)}
                disabled={disabled || option.disabled}
                className="h-4 w-4 cursor-pointer"
              />
              <label
                htmlFor={option.value}
                className="text-sm font-medium cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </FormField>
    );
  }
);

FormRadioGroup.displayName = "FormRadioGroup";

// Form Date Input
export interface FormDateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const FormDateInput = React.forwardRef<
  HTMLInputElement,
  FormDateInputProps
>(({ label, error, required, hint, ...props }, ref) => {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input ref={ref} type="date" {...props} />
    </FormField>
  );
});

FormDateInput.displayName = "FormDateInput";

// Form Time Input
export interface FormTimeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const FormTimeInput = React.forwardRef<
  HTMLInputElement,
  FormTimeInputProps
>(({ label, error, required, hint, ...props }, ref) => {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input ref={ref} type="time" {...props} />
    </FormField>
  );
});

FormTimeInput.displayName = "FormTimeInput";

// Form Number Input
export interface FormNumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const FormNumberInput = React.forwardRef<
  HTMLInputElement,
  FormNumberInputProps
>(({ label, error, required, hint, ...props }, ref) => {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input ref={ref} type="number" {...props} />
    </FormField>
  );
});

FormNumberInput.displayName = "FormNumberInput";

// Form Email Input
export interface FormEmailInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const FormEmailInput = React.forwardRef<
  HTMLInputElement,
  FormEmailInputProps
>(({ label, error, required, hint, ...props }, ref) => {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input ref={ref} type="email" {...props} />
    </FormField>
  );
});

FormEmailInput.displayName = "FormEmailInput";
