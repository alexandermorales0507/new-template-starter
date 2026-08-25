import type { StoryMessageData } from "@/platform/event-template-data";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { CorrespondenceSheet } from "@/template/components/containers/CorrespondenceSheet";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.

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
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              FOLIO // 14 &bull; THE STORY
            </span>
            <h2 className="text-role-heading-major text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.storyTitle || "The Story"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-lg mx-auto mt-2 leading-relaxed text-[var(--event-on-dark-muted,#94a3b8)]">
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
                caption="Comic Origin Story"
                specimenNumber="ISSUE // 14"
                aspectRatio="landscape"
                className="shadow-[var(--event-shadow-paper-md)] bg-[var(--event-surface)]"
              />
            )}

            {/* Story Description Card */}
            {data.storyBody && (
              <div className="relative overflow-visible">
                <CorrespondenceSheet
                  senderLabel="HERO ORIGIN"
                  dateStamp="CHRONICLE"
                  className="bg-[var(--event-surface)] relative z-10"
                >
                  <p className="text-base sm:text-lg text-[var(--event-text-main)] leading-relaxed font-sans text-left pt-1">
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
