import type { StoryMessageData } from "@/platform/event-template-data";
import { templateAssets } from "@/template/template-assets";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { CorrespondenceSheet } from "@/template/components/containers/CorrespondenceSheet";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE STORY MESSAGE JOURNAL (THE GLASSHOUSE LEDGER)

export type StoryMessageSectionProps = {
  data: StoryMessageData;
};

export type LoveStorySectionProps = StoryMessageSectionProps;

export function StoryMessageSection({ data }: StoryMessageSectionProps) {
  if (!data.storyBody && !data.storyTitle) return null;
  const storyPhotos = templateAssets.photos.story || [];

  return (
    <section
      id="story_message"
      className="template-section section-surface-paper pattern-ledger-rule pattern-subtle relative overflow-x-clip"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="text-role-subheading">FOLIO // 14 &bull; THE STORY</span>
            <h2 className="text-role-heading-major text-[var(--event-text,#24342c)] tracking-tight">
              {data.storyTitle || "Our Story"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-lg mx-auto mt-2 leading-relaxed">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="max-w-2xl mx-auto space-y-8 sm:space-y-10 md:space-y-12">
            {/* Story Photo Specimen Frame (Undecorated) */}
            {storyPhotos.length > 0 && (
              <SpecimenFrame
                src={storyPhotos[0]}
                alt="Story Photo"
                caption="Archival Journal Memory"
                specimenNumber="MEMORY // 14"
                aspectRatio="landscape"
                className="shadow-soft bg-[var(--event-surface,#fffdf7)]"
              />
            )}

            {/* Story Description Card with Elevated Outward Botanical Corner Framing */}
            {data.storyBody && (
              <div className="relative overflow-visible">
                <BotanicalCornerPair
                  size="lg"
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36"
                  leftOffset="-top-7 -left-6 sm:-top-9 sm:-left-8 md:-top-11 md:-left-10"
                  rightOffset="-top-7 -right-6 sm:-top-9 sm:-right-8 md:-top-11 md:-right-10"
                />
                <CorrespondenceSheet
                  senderLabel="ESTATE DISPATCH"
                  dateStamp="CHRONICLE"
                  className="bg-[var(--event-surface,#fffdf7)] relative z-10"
                >
                  <p className="text-base sm:text-lg text-[var(--event-text,#24342c)] leading-relaxed font-sans text-left pt-1">
                    &ldquo;{data.storyBody}&rdquo;
                  </p>
                </CorrespondenceSheet>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export const LoveStorySection = StoryMessageSection;
