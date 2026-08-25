import * as React from "react";
import { cn } from "../ui/cn";

export interface LedgerPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  indexTag?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  headerAlign?: "left" | "center";
}

export function LedgerPanel({
  className,
  indexTag,
  title,
  subtitle,
  children,
  footer,
  headerAlign = "left",
  ...props
}: LedgerPanelProps) {
  const isCentered = headerAlign === "center";

  return (
    <div
      data-surface="light"
      className={cn(
        "ledger-panel relative rounded-2xl border border-[var(--event-border)] bg-[var(--event-surface)] text-[var(--event-text)] p-6 sm:p-8 shadow-xs text-left transition-all",
        className
      )}
      {...props}
    >
      {/* Optional Top Ledger Index Bar */}
      {indexTag || title ? (
        <div
          className={cn(
            "mb-6 border-b border-[var(--event-border-subtle)] pb-4",
            isCentered ? "text-center" : "text-left"
          )}
        >
          {indexTag ? (
            <div
              className={cn(
                "flex gap-4",
                isCentered ? "items-center justify-center" : "items-center justify-between"
              )}
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[var(--event-accent-strong,#8f6a2c)] uppercase">
                {indexTag}
              </span>
            </div>
          ) : null}
          {title ? (
            <h3 className="mt-1 font-serif text-xl font-bold tracking-wider text-[var(--event-text)]">
              {title}
            </h3>
          ) : null}
          {subtitle ? (
            <p className="mt-0.5 text-xs text-[var(--event-text-muted)] font-sans">{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="space-y-4">{children}</div>

      {/* Optional Footer Strip */}
      {footer ? (
        <div className="mt-6 border-t border-[var(--event-border-subtle)] pt-4 text-xs text-[var(--event-text-muted)]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
