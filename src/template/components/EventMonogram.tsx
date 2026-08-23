import type { ComponentPropsWithoutRef } from "react";
import { deriveHostIdentity, extractMilestoneNumber } from "@/template/utils/host-identity";

export type EventMonogramProps = ComponentPropsWithoutRef<"span"> & {
  groomName?: string;
  brideName?: string;
  coupleDisplayName?: string;
  milestone?: string | number;
  variant?: "nav" | "hero" | "footer" | "badge" | "seal";
};

export function EventMonogram({
  groomName,
  brideName,
  coupleDisplayName,
  milestone,
  variant = "nav",
  className = "",
  ...props
}: EventMonogramProps) {
  const identity = deriveHostIdentity(groomName, brideName, coupleDisplayName);
  const milestoneNum = extractMilestoneNumber(milestone ? String(milestone) : undefined);
  const isSingleHost = !identity.brideInitial;

  const initial = identity.groomInitial || identity.monogram;

  if (variant === "badge") {
    const badgeText = isSingleHost
      ? milestoneNum
        ? `${initial}${milestoneNum}`
        : initial
      : identity.compactMonogram;

    return (
      <span
        className={`w-8 h-8 rounded-full bg-[var(--event-primary,#657a57)] text-[var(--event-on-primary,#ffffff)] flex items-center justify-center text-xs font-semibold shrink-0 select-none shadow-xs font-mono ${className}`}
        {...props}
      >
        {badgeText}
      </span>
    );
  }

  if (variant === "seal") {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center p-3.5 rounded-full border border-[var(--event-accent,#8f6a2c)]/80 ring-2 ring-[var(--event-accent,#8f6a2c)]/25 bg-[var(--event-surface,#fffdf7)]/95 backdrop-blur-xs shadow-soft select-none ${className}`}
        {...props}
      >
        <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[var(--event-text,#24342c)] flex items-center">
          <span>{initial}</span>
          {!isSingleHost ? (
            <>
              <span className="text-[var(--event-accent,#8f6a2c)] font-serif italic font-normal mx-1.5 text-lg sm:text-xl">
                &amp;
              </span>
              <span>{identity.brideInitial}</span>
            </>
          ) : milestoneNum ? (
            <>
              <span className="text-[var(--event-accent,#8f6a2c)] font-serif font-bold mx-1 text-lg sm:text-xl">
                &bull;
              </span>
              <span className="font-mono text-lg sm:text-xl">{milestoneNum}</span>
            </>
          ) : null}
        </span>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <span
        className={`inline-flex items-center justify-center gap-2 font-serif text-2xl md:text-3xl font-bold tracking-wider text-[var(--event-text,#24342c)] ${className}`}
        {...props}
      >
        <span>{initial}</span>
        {!isSingleHost ? (
          <>
            <span className="text-[var(--event-accent,#8f6a2c)] font-serif italic font-normal mx-1">
              &amp;
            </span>
            <span>{identity.brideInitial}</span>
          </>
        ) : milestoneNum ? (
          <>
            <span className="text-[var(--event-accent,#8f6a2c)] font-serif font-bold mx-1">
              &bull;
            </span>
            <span className="font-mono text-2xl md:text-3xl">{milestoneNum}</span>
          </>
        ) : null}
      </span>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center gap-1.5 ${className}`}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5 font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[var(--event-on-dark,#f7f4ea)]">
          <span>{initial}</span>
          {!isSingleHost ? (
            <>
              <span className="text-[var(--event-accent,#8f6a2c)] font-serif italic font-normal mx-1 text-xl sm:text-2xl">
                &amp;
              </span>
              <span>{identity.brideInitial}</span>
            </>
          ) : milestoneNum ? (
            <>
              <span className="text-[var(--event-accent,#8f6a2c)] font-serif font-bold mx-1 text-xl sm:text-2xl">
                &bull;
              </span>
              <span className="font-mono text-xl sm:text-2xl">{milestoneNum}</span>
            </>
          ) : null}
        </span>
        <span className="text-xs tracking-wider uppercase text-[var(--event-accent-soft,#c7cfbc)] font-mono">
          {identity.displayName}
        </span>
      </div>
    );
  }

  // Default nav variant: Minimal, elegant dynamic text glyphs (e.g. "J & A", "M • 10", or "M")
  return (
    <span
      className={`event-nav-monogram font-serif text-lg md:text-xl font-bold tracking-widest text-[var(--event-text,#24342c)] hover:opacity-80 transition-opacity select-none ${className}`}
      {...props}
    >
      <span className="event-monogram-glyphs flex items-center">
        <span>{initial}</span>
        {!isSingleHost ? (
          <>
            <span className="text-[var(--event-accent,#8f6a2c)] font-serif italic font-normal mx-1 text-base">
              &amp;
            </span>
            <span>{identity.brideInitial}</span>
          </>
        ) : milestoneNum ? (
          <>
            <span className="text-[var(--event-accent,#8f6a2c)] font-serif font-bold mx-1 text-base">
              &bull;
            </span>
            <span className="font-mono text-base">{milestoneNum}</span>
          </>
        ) : null}
      </span>
    </span>
  );
}
