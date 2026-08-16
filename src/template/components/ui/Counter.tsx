import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "./cn";

export interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  helperText?: string;
  className?: string;
}

export function Counter({
  value,
  onChange,
  min = 0,
  max = 10,
  label,
  helperText,
  className,
}: CounterProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border border-[var(--wedding-border)] bg-[var(--wedding-surface)] font-sans",
        className
      )}
    >
      <div className="space-y-0.5 text-left">
        {label ? (
          <span className="block text-sm font-semibold text-[var(--wedding-text)]">{label}</span>
        ) : null}
        {helperText ? (
          <span className="block text-xs text-[var(--wedding-text-muted)]">{helperText}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-3 select-none">
        <button
          type="button"
          onClick={() => canDecrement && onChange(value - 1)}
          disabled={!canDecrement}
          aria-label="Decrease value"
          className="w-8 h-8 rounded-lg border border-[var(--wedding-border)] flex items-center justify-center text-[var(--wedding-text)] hover:bg-[var(--wedding-surface-alt)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer template-focus-ring"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-base font-bold text-[var(--wedding-text)] tabular-nums font-mono">
          {value}
        </span>
        <button
          type="button"
          onClick={() => canIncrement && onChange(value + 1)}
          disabled={!canIncrement}
          aria-label="Increase value"
          className="w-8 h-8 rounded-lg border border-[var(--wedding-border)] flex items-center justify-center text-[var(--wedding-text)] hover:bg-[var(--wedding-surface-alt)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer template-focus-ring"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
