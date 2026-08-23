import type { ComponentPropsWithoutRef } from "react";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";

export type WeddingMonogramProps = ComponentPropsWithoutRef<"span"> & {
  groomName?: string;
  brideName?: string;
  coupleDisplayName?: string;
  variant?: "nav" | "hero" | "footer" | "badge" | "seal";
};

export function WeddingMonogram({
  groomName,
  brideName,
  coupleDisplayName,
  variant = "nav",
  className = "",
  ...props
}: WeddingMonogramProps) {
  const identity = deriveCoupleIdentity(groomName, brideName, coupleDisplayName);

  if (variant === "badge") {
    return (
      <span
        className={`w-8 h-8 rounded-full bg-[var(--wedding-primary)] text-[var(--wedding-on-primary)] flex items-center justify-center text-xs font-semibold shrink-0 select-none shadow-xs font-mono ${className}`}
        {...props}
      >
        {identity.compactMonogram}
      </span>
    );
  }

  if (variant === "seal") {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center p-3.5 rounded-full border border-[var(--wedding-accent)]/80 ring-2 ring-[var(--wedding-accent)]/25 bg-[var(--wedding-surface)]/95 backdrop-blur-xs shadow-soft select-none ${className}`}
        {...props}
      >
        <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[var(--wedding-text)] flex items-center">
          <span>{identity.groomInitial || identity.monogram}</span>
          {identity.brideInitial ? (
            <>
              <span className="text-[var(--wedding-accent)] font-serif italic font-normal mx-1.5 text-lg sm:text-xl">
                &amp;
              </span>
              <span>{identity.brideInitial}</span>
            </>
          ) : null}
        </span>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <span
        className={`inline-flex items-center justify-center gap-2 font-serif text-2xl md:text-3xl font-bold tracking-wider text-[var(--wedding-text)] ${className}`}
        {...props}
      >
        <span>{identity.groomInitial || identity.monogram}</span>
        {identity.brideInitial ? (
          <>
            <span className="text-[var(--wedding-accent)] font-serif italic font-normal mx-1">
              &amp;
            </span>
            <span>{identity.brideInitial}</span>
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
        <span className="inline-flex items-center gap-1.5 font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[var(--wedding-on-dark)]">
          <span>{identity.groomInitial || identity.monogram}</span>
          {identity.brideInitial ? (
            <>
              <span className="text-[var(--wedding-accent)] font-serif italic font-normal mx-1 text-xl sm:text-2xl">
                &amp;
              </span>
              <span>{identity.brideInitial}</span>
            </>
          ) : null}
        </span>
        <span className="text-xs tracking-wider uppercase text-[var(--wedding-accent-soft)] font-mono">
          {identity.displayName}
        </span>
      </div>
    );
  }

  // Default nav variant: Minimal, elegant dynamic text glyphs ONLY (e.g. "J & A" or "M")
  return (
    <span
      className={`wedding-nav-monogram font-serif text-lg md:text-xl font-bold tracking-widest text-[var(--wedding-text)] hover:opacity-80 transition-opacity select-none ${className}`}
      {...props}
    >
      <span className="wedding-monogram-glyphs flex items-center">
        <span>{identity.groomInitial || identity.monogram}</span>
        {identity.brideInitial ? (
          <>
            <span className="text-[var(--wedding-accent)] font-serif italic font-normal mx-1 text-base">
              &amp;
            </span>
            <span>{identity.brideInitial}</span>
          </>
        ) : null}
      </span>
    </span>
  );
}
