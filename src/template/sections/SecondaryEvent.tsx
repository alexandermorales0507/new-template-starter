import type { SecondaryEventData } from "@/platform/event-template-data";
import { formatTimeRange } from "@/template/utils/event-formatting";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Clock, MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE SECONDARY EVENT / RECEPTION (THE GLASSHOUSE LEDGER)

export type SecondaryEventSectionProps = {
  data: SecondaryEventData;
  eventDate?: string | null;
};

export type ReceptionSectionProps = SecondaryEventSectionProps;

export function SecondaryEventSection({ data }: SecondaryEventSectionProps) {
  const timeFormatted = formatTimeRange(data.startTime, data.endTime);
  const title = data.title || "Dinner & Celebration";

  return (
    <section
      id="secondary_event"
      className="template-section section-surface-forest pattern-glazing-grid pattern-subtle pattern-dark relative overflow-x-clip"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent-soft,#c7cfbc)]">
              FOLIO // 05 &bull; RECEPTION &amp; DINNER
            </span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f7f4ea)] tracking-tight">
              {title}
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <BotanicalCornerPair size="md" />
            <LedgerPanel
              title={data.venueName || "Event Grounds"}
              indexTag="RECORD // 02"
              className="bg-[var(--event-surface,#fffdf7)] text-[var(--event-text,#24342c)] shadow-card relative z-10"
            >
              <div className="space-y-4 pt-1 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {timeFormatted && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt,#dde5d3)] border border-[var(--event-border-subtle,#e1e7d9)]">
                      <Clock className="w-5 h-5 text-[var(--event-primary,#657a57)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--event-text-muted,#5d695f)] block mb-0.5">
                          Program Hours
                        </span>
                        <p className="text-base sm:text-lg font-bold text-[var(--event-text,#24342c)] font-serif">
                          {timeFormatted}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.address && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt,#dde5d3)] border border-[var(--event-border-subtle,#e1e7d9)]">
                      <MapPin className="w-5 h-5 text-[var(--event-primary,#657a57)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--event-text-muted,#5d695f)] block mb-0.5">
                          Location
                        </span>
                        <p className="text-base font-medium text-[var(--event-text,#24342c)] leading-relaxed font-sans">
                          {data.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {data.note && (
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt,#dde5d3)] border border-[var(--event-border-subtle,#e1e7d9)] text-sm text-[var(--event-text,#24342c)]">
                    <Info className="w-5 h-5 text-[var(--event-primary,#657a57)] shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-sans text-sm sm:text-base">{data.note}</p>
                  </div>
                )}

                {data.mapsLink && (
                  <div className="pt-2 font-sans">
                    <a
                      href={data.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 py-3 px-6 bg-[var(--event-primary,#657a57)] hover:bg-[var(--event-primary-hover,#4f6445)] text-[var(--event-on-primary,#ffffff)] text-sm font-semibold rounded-xl transition-all shadow-xs template-focus-ring cursor-pointer min-h-[44px]"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                )}
              </div>
            </LedgerPanel>
          </div>
        </Reveal>
      </div>

      {/* Boundary Threshold Divider: Secondary Event -> Timeline */}
      <SectionFloralDivider />
    </section>
  );
}

export const ReceptionSection = SecondaryEventSection;
