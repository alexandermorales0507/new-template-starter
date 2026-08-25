import type { StoryMessageData } from "@/platform/event-template-data";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
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
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="comic-badge comic-badge-gold">ORIGIN // THE HERO&apos;S JOURNEY</span>
            <h2 className="text-role-heading-major text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.storyTitle || "The Origin Story"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-lg mx-auto mt-2 leading-relaxed text-slate-300">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Origin Specimen Photo */}
            {storyPhotos.length > 0 && (
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] sm:max-w-sm rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
                  <SpecimenFrame
                    src={storyPhotos[0]}
                    alt="Origin Photo"
                    caption="Hero Chronicle"
                    specimenNumber="ARCHIVE // YR 10"
                    aspectRatio="portrait"
                    className="bg-white border-[3px] border-slate-950 shadow-[8px_8px_0px_#0f172a] rounded-2xl"
                  />
                </div>
              </div>
            )}

            {/* Right Column: Comic Origin Dossier Sheet */}
            {data.storyBody && (
              <div
                className={
                  storyPhotos.length > 0
                    ? "md:col-span-7"
                    : "md:col-span-12 max-w-2xl mx-auto w-full"
                }
              >
                <div className="bg-white text-slate-900 border-[3px] border-slate-950 shadow-[8px_8px_0px_#0f172a] rounded-2xl overflow-hidden">
                  {/* Top Narrator Strip */}
                  <div className="bg-amber-300 border-b-[2.5px] border-slate-950 px-5 py-2.5 flex items-center justify-between font-mono text-xs font-black tracking-widest text-slate-950 uppercase">
                    <span>MEANWHILE, AT HEADQUARTERS...</span>
                    <span className="text-[var(--event-primary)] font-black">DOSSIER // 01</span>
                  </div>

                  {/* Dossier Body Prose */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <p className="text-base sm:text-lg leading-relaxed font-sans text-slate-900 font-medium">
                      &ldquo;{data.storyBody}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export const LoveStorySection = StoryMessageSection;
