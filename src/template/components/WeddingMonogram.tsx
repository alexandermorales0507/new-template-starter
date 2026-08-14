import type { ComponentPropsWithoutRef } from "react";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";

export type WeddingMonogramProps = ComponentPropsWithoutRef<"span"> & {
  groomName?: string;
  brideName?: string;
  coupleDisplayName?: string;
  variant?: "nav" | "hero" | "footer" | "badge";
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
        className={`w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0 select-none ${className}`}
        {...props}
      >
        {identity.compactMonogram}
      </span>
    );
  }

  if (variant === "hero") {
    return (
      <span
        className={`inline-flex items-center justify-center gap-2 font-serif text-2xl md:text-3xl font-semibold tracking-wider text-gray-900 ${className}`}
        {...props}
      >
        <span>{identity.groomInitial}</span>
        <span className="text-gray-400 font-light">&amp;</span>
        <span>{identity.brideInitial}</span>
      </span>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center gap-1 ${className}`}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5 font-serif text-xl font-bold tracking-widest text-gray-900">
          <span>{identity.groomInitial}</span>
          <span className="text-gray-400 font-normal">&amp;</span>
          <span>{identity.brideInitial}</span>
        </span>
        <span className="text-xs text-gray-500 font-medium">{identity.displayName}</span>
      </div>
    );
  }

  // Default nav variant: Minimal, elegant dynamic text glyphs ONLY (e.g. "J & A")
  return (
    <span
      className={`wedding-nav-monogram font-serif text-lg md:text-xl font-bold tracking-widest text-gray-900 hover:opacity-80 transition-opacity select-none ${className}`}
      {...props}
    >
      <span className="wedding-monogram-glyphs">
        <span>{identity.groomInitial}</span>
        <span className="text-gray-400 font-light mx-1">&amp;</span>
        <span>{identity.brideInitial}</span>
      </span>
    </span>
  );
}
