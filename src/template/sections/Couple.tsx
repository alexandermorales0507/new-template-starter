import type { CoupleData } from "@/platform/wedding-template-data";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { Reveal } from "@/template/components/motion/Reveal";
import { Magnetic } from "@/template/components/motion/Magnetic";
import { Heart, BookOpen } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE EDITORIAL HERO (THE GLASSHOUSE LEDGER)
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
      className="template-section section-surface-ivory pattern-glazing-grid pattern-feature min-h-0 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-8 lg:pb-6"
    >
      <div className="template-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-start">
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center">
            {/* 1. Folio Stamp */}
            <Reveal direction="down" distance={16}>
              <div className="flex items-center justify-center">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[var(--wedding-accent)] bg-[var(--wedding-surface)]/95 px-4 py-1.5 rounded-full border border-[var(--wedding-accent)]/40 shadow-xs">
                  ESTATE FOLIO // 01
                </span>
              </div>
            </Reveal>

            {/* 2. Couple Names */}
            <Reveal direction="up" distance={20} delay={0.1}>
              <h1 className="text-role-display tracking-tight">{displayName}</h1>
            </Reveal>

            {/* 3. Single Centered Connected Estate Date in Refined Pill Container */}
            {data.hostLine && (
              <Reveal direction="up" distance={16} delay={0.15}>
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center px-6 py-2 sm:px-7 sm:py-2.5 rounded-full bg-[var(--wedding-surface)] border border-[var(--wedding-border)] shadow-xs">
                    <span className="font-mono font-bold text-base sm:text-lg md:text-xl tracking-[0.2em] text-[var(--wedding-accent)] uppercase">
                      {data.hostLine}
                    </span>
                  </div>
                </div>
              </Reveal>
            )}

            {/* 4. Editorial Invitation Greeting ("you're invited!") */}
            {data.shortHostMessage && (
              <Reveal direction="up" distance={16} delay={0.25}>
                <p className="font-serif italic text-2xl sm:text-3xl text-[var(--wedding-text)] font-bold max-w-xl mx-auto leading-relaxed">
                  &ldquo;{data.shortHostMessage}&rdquo;
                </p>
              </Reveal>
            )}

            {/* 5. Action CTA Buttons */}
            <Reveal direction="up" distance={16} delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-sans">
                <Magnetic intensity={0.25}>
                  <a
                    href="/rsvp"
                    className="inline-flex items-center gap-2 py-3 px-6 bg-[var(--wedding-primary)] hover:bg-[var(--wedding-primary-hover)] text-[var(--wedding-on-primary)] text-sm font-semibold rounded-xl shadow-soft transition-all active:scale-95 template-focus-ring cursor-pointer min-h-[44px]"
                  >
                    <Heart className="w-4 h-4 fill-white/20" />
                    <span>Reserve Your Seat</span>
                  </a>
                </Magnetic>

                {storyEnabled && (
                  <a
                    href="#story_message"
                    className="inline-flex items-center gap-2 py-3 px-5 bg-[var(--wedding-surface)] hover:bg-[var(--wedding-surface-alt)] text-[var(--wedding-text)] text-sm font-medium rounded-xl border border-[var(--wedding-border)] transition-all active:scale-95 template-focus-ring cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--wedding-primary)]" />
                    <span>Our Story</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Mounted Portrait */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <Reveal direction="up" distance={24} delay={0.2} className="w-full flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-[430px] xl:max-w-[450px] lg:-mt-5">
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
