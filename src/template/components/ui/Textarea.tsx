import * as React from "react";
import { cn } from "./cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left font-sans">
        {label ? (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--wedding-text)]"
          >
            {label}
          </label>
        ) : null}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "flex w-full rounded-xl border border-[var(--wedding-border)] bg-[var(--wedding-surface)] px-3.5 py-2.5 text-sm text-[var(--wedding-text)] placeholder:text-[var(--wedding-text-muted)] transition-colors focus:border-[var(--wedding-primary)] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 template-focus-ring resize-y",
            error && "border-red-500 focus:border-red-600",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--wedding-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
