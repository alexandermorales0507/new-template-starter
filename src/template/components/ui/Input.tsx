import * as React from "react";
import { cn } from "./cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left font-sans">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--event-text)]"
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[var(--event-border)] bg-[var(--event-surface)] px-3.5 py-2 text-sm text-[var(--event-text)] placeholder:text-[var(--event-text-muted)] transition-colors focus:border-[var(--event-primary)] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 template-focus-ring",
            error && "border-red-500 focus:border-red-600",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--event-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
