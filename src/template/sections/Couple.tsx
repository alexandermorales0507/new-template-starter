import type { CoupleData } from "@/platform/wedding-template-data";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { SageAuroraBackground } from "@/template/components/backgrounds/SageAuroraBackground";
import { Reveal } from "@/template/components/motion/Reveal";
import { Magnetic } from "@/template/components/motion/Magnetic";
import { Heart, BookOpen } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE EDITORIAL HERO (THE GLASSHOUSE LEDGER — ESTATE FOREST AURORA)
// DYNAMIC COUPLE IDENTITY: Never hardcode client initials or names.

export type CoupleSectionProps = {
  data: CoupleData;
  eventDate?: string | null;
  storyEnabled?: boolean;
};

export function CoupleSection({ data, storyEnabled = true }: CoupleSectionProps) {
  const identity = deriveCoupleIdentity(data.groomName, data.brideName);
  const heroPhoto = templateAssets.photos.hero;

  const displayName =
    data.displayAs === "bride_first"
      ? `${data.brideName || identity.brideName} & ${data.groomName || identity.groomName}`
      : `${data.groomName || identity.groomName} & ${data.brideName || identity.brideName}`;

  return (
    <section
      id="host_info"
      className="template-section section-surface-aurora relative isolate overflow-hidden min-h-0 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-8 lg:pb-8 text-[var(--wedding-on-dark)]"
    >
      {/* Botanical Dawn Animated Aurora Gradient Waves */}
      <SageAuroraBackground />

      <div className="template-container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-start">
          {/* Left Column: Editorial Typography & Actions (Left-aligned on desktop, Centered on mobile/tablet) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left lg:pt-1.5">
            {/* 1. Folio Stamp */}
            <Reveal direction="down" distance={16}>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[var(--wedding-accent)] estate-glass-light px-4 py-1.5 rounded-full border shadow-xs">
                  ESTATE FOLIO // 01
                </span>
              </div>
            </Reveal>

            {/* 2. Couple Names — Luminous Warm Ivory on Aurora */}
            <Reveal direction="up" distance={20} delay={0.1}>
              <h1 className="text-role-display tracking-tight text-[var(--wedding-on-dark)] drop-shadow-xs text-center lg:text-left">
                {displayName}
              </h1>
            </Reveal>

            {/* 3. Single Connected Estate Date in Light Estate Glass Pill Container */}
            {data.hostLine && (
              <Reveal direction="up" distance={16} delay={0.15}>
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center justify-center px-6 py-2 sm:px-7 sm:py-2.5 rounded-full estate-glass-light border shadow-xs">
                    <span className="font-mono font-bold text-base sm:text-lg md:text-xl tracking-[0.2em] text-[var(--wedding-accent)] uppercase">
                      {data.hostLine}
                    </span>
                  </div>
                </div>
              </Reveal>
            )}

            {/* 4. Editorial Invitation Greeting ("you're invited!") — Luminous Warm Ivory */}
            {data.shortHostMessage && (
              <Reveal direction="up" distance={16} delay={0.25}>
                <p className="font-serif italic text-2xl sm:text-3xl text-[var(--wedding-on-dark)] font-bold max-w-xl mx-auto lg:mx-0 text-center lg:text-left leading-relaxed drop-shadow-xs">
                  &ldquo;{data.shortHostMessage}&rdquo;
                </p>
              </Reveal>
            )}

            {/* 5. Action CTA Buttons with Estate Glass Architecture */}
            <Reveal direction="up" distance={16} delay={0.3}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 font-sans">
                <Magnetic intensity={0.25}>
                  <a
                    href="/rsvp"
                    className="inline-flex items-center gap-2 py-3 px-6 estate-glass-sage hover:bg-[var(--wedding-primary)] text-[var(--wedding-on-primary)] text-sm font-semibold rounded-xl border shadow-soft transition-all active:scale-95 template-focus-ring cursor-pointer min-h-[44px]"
                  >
                    <Heart className="w-4 h-4 fill-white/20" />
                    <span>Reserve Your Seat</span>
                  </a>
                </Magnetic>

                {storyEnabled && (
                  <a
                    href="#story_message"
                    className="inline-flex items-center gap-2 py-3 px-5 estate-glass-light hover:bg-[var(--wedding-surface)] text-[var(--wedding-text)] text-sm font-medium rounded-xl border transition-all active:scale-95 template-focus-ring cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--wedding-primary)]" />
                    <span>Our Story</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Mounted Portrait in SpecimenFrame (Viewport-fit responsive sizing) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center lg:justify-start lg:self-start">
            <Reveal
              direction="up"
              distance={24}
              delay={0.2}
              className="w-full flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[320px] sm:max-w-sm lg:max-w-[min(360px,calc((100dvh-11.5rem)*0.75))] xl:max-w-[min(385px,calc((100dvh-11.5rem)*0.75))]">
                <SpecimenFrame
                  src={heroPhoto}
                  alt={displayName}
                  specimenNumber="PORTRAIT FOLIO // 01"
                  aspectRatio="portrait"
                  priority={true}
                  className="shadow-floating bg-[var(--wedding-surface)]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
