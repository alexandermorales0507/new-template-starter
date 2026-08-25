import type { HostInfoData } from "@/platform/event-template-data";
import { deriveHostIdentity } from "@/template/utils/host-identity";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { Reveal } from "@/template/components/motion/Reveal";
import { Magnetic } from "@/template/components/motion/Magnetic";
import { Zap, BookOpen } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// DYNAMIC HOST IDENTITY: Never hardcode client initials or names.

export type HeroHostSectionProps = {
  data: HostInfoData;
  eventDate?: string | null;
  storyEnabled?: boolean;
};

export type CoupleSectionProps = HeroHostSectionProps;

export function HeroHostSection({ data, storyEnabled = true }: HeroHostSectionProps) {
  const identity = deriveHostIdentity(data.groomName, data.brideName);
  const heroPhoto = templateAssets.photos.hero;

  const isSingleHost = !data.brideName || identity.brideInitial === "";

  const displayName = isSingleHost
    ? data.celebrantName || data.groomName || identity.groomName || "The Celebrant"
    : data.displayAs === "bride_first"
      ? `${data.brideName || identity.brideName} & ${data.groomName || identity.groomName}`
      : `${data.groomName || identity.groomName} & ${data.brideName || identity.brideName}`;

  const badgeText = data.hostLine || "A Special Celebration";

  return (
    <section
      id="host_info"
      className="template-section bg-[var(--event-bg)] pattern-comic-dots relative isolate overflow-hidden min-h-0 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-6 lg:pb-8 text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-start">
          {/* Left Column: Editorial Typography & Actions (Left-aligned on desktop, Centered on mobile/tablet) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left lg:pt-2">
            {/* 1. Comic Issue & Milestone Badges */}
            <Reveal direction="down" distance={16}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="comic-badge comic-badge-gold">
                  ★ ISSUE #10 • SPECIAL EDITION ★
                </span>
                {badgeText && (
                  <span className="comic-badge comic-badge-red">⚡ {badgeText} ⚡</span>
                )}
              </div>
            </Reveal>

            {/* 2. Celebrant / Couple Names — Massive Action Display */}
            <Reveal direction="up" distance={20} delay={0.1}>
              <h1 className="text-role-display tracking-tight text-white drop-shadow-[4px_4px_0px_#0f172a] text-center lg:text-left">
                {displayName}
              </h1>
            </Reveal>

            {/* 3. Host Narration / Quote in Yellow Marvel Narrator Box */}
            {data.shortHostMessage && (
              <Reveal direction="up" distance={16} delay={0.2}>
                <div className="comic-caption-box max-w-xl mx-auto lg:mx-0 text-slate-950 font-bold text-base sm:text-lg leading-snug">
                  &ldquo;{data.shortHostMessage}&rdquo;
                </div>
              </Reveal>
            )}

            {/* 4. Action CTA Buttons with Comic Tactile Push Architecture */}
            <Reveal direction="up" distance={16} delay={0.3}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 font-sans">
                <Magnetic intensity={0.25}>
                  <a
                    href="/rsvp"
                    className="comic-button comic-button-primary text-white gap-2 text-base font-bold min-h-[48px]"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>RSVP TO ASSEMBLE</span>
                  </a>
                </Magnetic>

                {storyEnabled && (
                  <a
                    href="#story_message"
                    className="comic-button comic-button-secondary text-slate-950 gap-2 text-base font-bold min-h-[48px]"
                  >
                    <BookOpen className="w-4 h-4 text-slate-950" />
                    <span>ORIGIN STORY</span>
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
                  specimenNumber="COVER ART // ISSUE #10"
                  aspectRatio="portrait"
                  priority={true}
                  className="shadow-floating bg-white"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export const CoupleSection = HeroHostSection;
