import * as React from "react";
import { cn } from "../ui/cn";

export interface CorrespondenceSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  dateStamp?: string;
  senderLabel?: string;
}

export function CorrespondenceSheet({
  className,
  dateStamp,
  senderLabel,
  children,
  ...props
}: CorrespondenceSheetProps) {
  return (
    <div
      data-surface="light"
      className={cn(
        "correspondence-sheet relative mx-auto w-full max-w-3xl rounded-2xl border border-[var(--event-border)] bg-[var(--event-surface)] text-[var(--event-text)] p-8 sm:p-12 shadow-card text-left transition-all",
        className
      )}
      {...props}
    >
      {/* Subtle Header Stamp */}
      {dateStamp || senderLabel ? (
        <div className="mb-8 flex items-center justify-between border-b border-[var(--event-border-subtle)] pb-3 text-xs tracking-widest uppercase text-[var(--event-accent-strong,#8f6a2c)] font-mono">
          <span>{senderLabel || "ESTATE DISPATCH"}</span>
          <span>{dateStamp || "ARCHIVE RECORD"}</span>
        </div>
      ) : null}

      {/* Sheet Content */}
      <div className="space-y-6 leading-relaxed text-[var(--event-text)] text-sm sm:text-base font-sans">
        {children}
      </div>
    </div>
  );
}
