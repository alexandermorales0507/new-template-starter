import Image from "next/image";
import type { LoveStoryData } from "@/platform/wedding-template-data";
import { templateAssets, sageDecorations } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { CorrespondenceSheet } from "@/template/components/containers/CorrespondenceSheet";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE LOVE STORY JOURNAL (THE GLASSHOUSE LEDGER)

export function LoveStorySection({ data }: { data: LoveStoryData }) {
  if (!data.storyBody && !data.storyTitle) return null;
  const storyPhotos = templateAssets.photos.story || [];

  return (
    <section id="story_message" className="template-section section-surface-paper">
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            {/* Archival Story Crest Header */}
            <div className="flex justify-center mb-1.5" aria-hidden="true">
              <Image
                src={sageDecorations.ledgerCrest}
                alt=""
                width={80}
                height={80}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none opacity-90"
              />
            </div>

            <span className="text-role-subheading">FOLIO // 14 &bull; OUR STORY</span>
            <h2 className="text-role-heading-major text-[var(--wedding-text)] tracking-tight">
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
          <div className="max-w-2xl mx-auto space-y-6">
            {storyPhotos.length > 0 && (
              <SpecimenFrame
                src={storyPhotos[0]}
                alt="Our Story Photo"
                caption="Archival Journal Memory"
                specimenNumber="MEMORY // 14"
                aspectRatio="landscape"
                className="shadow-soft bg-[var(--wedding-surface)]"
              />
            )}

            {data.storyBody && (
              <CorrespondenceSheet
                senderLabel="ESTATE DISPATCH"
                dateStamp="OUR CHRONICLE"
                className="bg-[var(--wedding-surface)]"
              >
                <p className="text-base sm:text-lg text-[var(--wedding-text)] leading-relaxed font-sans text-left pt-1">
                  &ldquo;{data.storyBody}&rdquo;
                </p>
              </CorrespondenceSheet>
            )}

            {/* Subtle Closing Chronicle Flourish (Restrained ~50% scale relative to RSVP) */}
            <div
              aria-hidden="true"
              className="relative mx-auto mt-6 w-48 sm:w-60 md:w-72 pointer-events-none select-none opacity-85"
            >
              <Image
                src={sageDecorations.parterreGrand}
                alt=""
                width={288}
                height={216}
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
