import type { HostInfoData } from "@/platform/event-template-data";
import { deriveHostIdentity, extractMilestoneNumber } from "@/template/utils/host-identity";
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

  const milestoneNum =
    extractMilestoneNumber(data.milestoneAge ? String(data.milestoneAge) : data.hostLine) || "10";

  // Dynamic Sub-Headline resolution (preserves custom dashboard emoji styles)
  const subHeadline =
    data.displayAs && data.displayAs.trim().toLowerCase() !== displayName.trim().toLowerCase()
      ? data.displayAs
      : data.milestoneAge
        ? `⚡ TURNING ${milestoneNum}! ⚡`
        : "⚡ A SPECIAL CELEBRATION ⚡";

  return (
    <section
      id="host_info"
      className="template-section bg-[var(--event-bg)] pattern-comic-dots relative isolate overflow-hidden min-h-0 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-8 lg:pb-12 text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Comic Masthead Typography & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            {/* 1. Clean Comic Issue Pill */}
            <Reveal direction="down" distance={16}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="comic-badge comic-badge-gold">
                  ★ ISSUE #{milestoneNum} • SPECIAL EDITION ★
                </span>
              </div>
            </Reveal>

            {/* 2. Unified Masthead Title Lockup with Host Line Eyebrow */}
            <Reveal direction="up" distance={20} delay={0.1}>
              <div className="space-y-1 sm:space-y-2">
                {/* Dedicated Host Line Eyebrow Kicker (self-collapsing if empty) */}
                {data.hostLine && (
                  <p className="font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-400">
                    {data.hostLine}
                  </p>
                )}
                <h1 className="text-role-display text-white drop-shadow-[4px_4px_0px_#0f172a] tracking-tight leading-[0.95]">
                  {displayName}
                </h1>
                <p className="text-role-heading-major text-amber-500 font-serif tracking-tight drop-shadow-[3px_3px_0px_#0f172a] flex items-center justify-center lg:justify-start gap-2">
                  <span>{subHeadline}</span>
                </p>
              </div>
            </Reveal>

            {/* 3. Transparent Frosted Dark Glass Narrative Box */}
            {data.shortHostMessage && (
              <Reveal direction="up" distance={16} delay={0.2}>
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-4 sm:p-5 w-fit max-w-lg mx-auto lg:mx-0 text-center lg:text-left space-y-2">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                      MISSION DISPATCH
                    </span>
                  </div>
                  <p className="text-slate-100 text-sm sm:text-base font-medium leading-relaxed">
                    &ldquo;{data.shortHostMessage}&rdquo;
                  </p>
                </div>
              </Reveal>
            )}

            {/* 4. Comic Push-Button CTAs */}
            <Reveal direction="up" distance={16} delay={0.3}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 font-sans">
                <Magnetic intensity={0.25}>
                  <a
                    href="/rsvp"
                    className="comic-button comic-button-primary text-white gap-2 text-base font-bold min-h-[48px] border-[2.5px] border-slate-950 shadow-[4px_4px_0px_#0f172a]"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>RSVP TO ASSEMBLE</span>
                  </a>
                </Magnetic>

                {storyEnabled && (
                  <a
                    href="#story_message"
                    className="comic-button comic-button-secondary bg-white text-slate-950 gap-2 text-base font-bold min-h-[48px] border-[2.5px] border-slate-950 shadow-[4px_4px_0px_#0f172a]"
                  >
                    <BookOpen className="w-4 h-4 text-slate-950" />
                    <span>ORIGIN STORY</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Comic Cover Art in Specimen Frame */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            <Reveal
              direction="up"
              distance={24}
              delay={0.2}
              className="w-full flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[320px] sm:max-w-sm lg:max-w-[360px] rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
                <SpecimenFrame
                  src={heroPhoto}
                  alt={displayName}
                  specimenNumber={`COVER ART // ISSUE #${milestoneNum}`}
                  aspectRatio="portrait"
                  priority={true}
                  className="bg-white border-[3.5px] border-slate-950 shadow-[10px_10px_0px_#0f172a] rounded-2xl"
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
