"use client";

import React from "react";
import { cn } from "../ui/cn";

export interface DateCalendarProps {
  date?: string | Date | null;
  locale?: string;
  highlightLabel?: string;
  className?: string;
}

export function DateCalendar({
  date,
  locale = "en-US",
  highlightLabel = "The Ceremony",
  className,
}: DateCalendarProps) {
  // Safe local date parsing to avoid UTC rollback
  const targetDate = React.useMemo(() => {
    if (!date) return null;
    if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
    const match = String(date)
      .trim()
      .match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const y = parseInt(match[1], 10);
      const m = parseInt(match[2], 10) - 1;
      const d = parseInt(match[3], 10);
      const parsed = new Date(y, m, d);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    const fallback = new Date(date);
    return isNaN(fallback.getTime()) ? null : fallback;
  }, [date]);

  // If no date is supplied, render a dignified non-highlighted current month or neutral state
  const activeDate = targetDate || new Date();
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const highlightedDay = targetDate ? targetDate.getDate() : null;

  const monthName = new Intl.DateTimeFormat(locale, { month: "long" }).format(activeDate);
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Create grid cells
  const days: { day: number; isCurrentMonth: boolean; isTarget: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      day: prevMonthTotalDays - i,
      isCurrentMonth: false,
      isTarget: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    days.push({
      day: d,
      isCurrentMonth: true,
      isTarget: d === highlightedDay,
    });
  }

  // Next month leading days to complete full weeks
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    days.push({
      day: n,
      isCurrentMonth: false,
      isTarget: false,
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--wedding-border)] bg-[var(--wedding-surface)] p-6 shadow-xs max-w-sm mx-auto text-center select-none",
        className
      )}
    >
      {/* Month & Year Header */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--wedding-border-subtle)] pb-3">
        <span className="font-serif text-xl font-bold text-[var(--wedding-text)] tracking-tight">
          {monthName}
        </span>
        <span className="font-mono text-xs font-bold text-[var(--wedding-accent-strong,#8f6a2c)]">
          {year}
        </span>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-[var(--wedding-text-muted)] uppercase tracking-wider mb-2 font-mono">
        {weekdays.map((w) => (
          <div key={w} className="h-6 flex items-center justify-center">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {days.map((cell, idx) => (
          <div
            key={idx}
            className={cn(
              "h-8 w-8 mx-auto flex items-center justify-center rounded-full font-medium transition-all font-sans",
              !cell.isCurrentMonth && "text-[var(--wedding-border)]",
              cell.isCurrentMonth &&
                !cell.isTarget &&
                "text-[var(--wedding-text)] hover:bg-[var(--wedding-surface-alt)]",
              cell.isTarget &&
                "bg-[var(--wedding-primary)] text-[var(--wedding-on-primary)] font-bold shadow-xs scale-105"
            )}
          >
            {cell.day}
          </div>
        ))}
      </div>

      {/* Highlight Tag */}
      {highlightLabel && targetDate ? (
        <div className="mt-4 pt-3 border-t border-[var(--wedding-border-subtle)] text-[11px] font-semibold text-[var(--wedding-text)] flex items-center justify-center gap-1.5 font-sans">
          <span className="w-2 h-2 rounded-full bg-[var(--wedding-primary)]" />
          <span>{highlightLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
