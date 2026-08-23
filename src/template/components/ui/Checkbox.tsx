import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer select-none text-left font-sans",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded-md border border-[var(--event-border)] bg-[var(--event-surface)] transition-all peer-checked:bg-[var(--event-primary)] peer-checked:border-[var(--event-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--event-primary)] peer-focus-visible:ring-offset-2 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-[var(--event-on-primary)] opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
          </div>
        </div>
        {label || description ? (
          <div className="space-y-0.5">
            {label ? (
              <span className="block text-sm font-medium text-[var(--event-text)]">{label}</span>
            ) : null}
            {description ? (
              <span className="block text-xs text-[var(--event-text-muted)]">{description}</span>
            ) : null}
          </div>
        ) : null}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
