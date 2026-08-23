import * as React from "react";
import { cn } from "./cn";

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
}

export interface RadioGroupProps<T extends string = string> {
  name: string;
  options: RadioOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
  direction?: "horizontal" | "vertical";
  variant?: "cards" | "pills" | "standard";
}

export function RadioGroup<T extends string = string>({
  name,
  options,
  value,
  onChange,
  className,
  direction = "horizontal",
  variant = "cards",
}: RadioGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "grid gap-3 font-sans",
        direction === "horizontal" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const inputId = `${name}-${option.value}`;

        if (variant === "pills") {
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                "inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none text-center template-focus-ring",
                isSelected
                  ? "bg-[var(--event-primary)] text-[var(--event-on-primary)] border-[var(--event-primary)] shadow-xs"
                  : "bg-[var(--event-surface)] text-[var(--event-text)] border-[var(--event-border)] hover:border-[var(--event-primary)]"
              )}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        }

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={cn(
              "flex items-start p-4 rounded-xl border transition-all cursor-pointer select-none text-left relative",
              isSelected
                ? "bg-[var(--event-surface-alt)] border-[var(--event-primary)] ring-1 ring-[var(--event-primary)] shadow-xs"
                : "bg-[var(--event-surface)] border-[var(--event-border)] hover:border-[var(--event-border-subtle)] hover:bg-[var(--event-surface-alt)]/50"
            )}
          >
            <input
              id={inputId}
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange?.(option.value)}
              className="sr-only"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-[var(--event-text)]" : "text-[var(--event-text-muted)]"
                  )}
                >
                  {option.label}
                </span>
                {option.badge ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--event-surface-alt)] text-[var(--event-text)] font-mono">
                    {option.badge}
                  </span>
                ) : null}
              </div>
              {option.description ? (
                <p className="text-xs text-[var(--event-text-muted)] leading-relaxed font-sans">
                  {option.description}
                </p>
              ) : null}
            </div>
          </label>
        );
      })}
    </div>
  );
}
