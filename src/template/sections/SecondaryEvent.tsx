import type { SecondaryEventData } from "@/platform/event-template-data";
import { formatTimeRange } from "@/template/utils/event-formatting";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Clock, MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.

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
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              FOLIO // 05 &bull; RECEPTION &amp; DINNER
            </span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {title}
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <LedgerPanel
              title={data.venueName || "Event Grounds"}
              indexTag="RECORD // 02"
              className="bg-[var(--event-surface)] text-[var(--event-text-main)] shadow-[var(--event-shadow-paper-md)] relative z-10"
            >
              <div className="space-y-4 pt-1 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {timeFormatted && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)]">
                      <Clock className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--event-text-muted)] block mb-0.5">
                          Program Hours
                        </span>
                        <p className="text-base sm:text-lg font-bold text-[var(--event-text-main)] font-sans">
                          {timeFormatted}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.address && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)]">
                      <MapPin className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--event-text-muted)] block mb-0.5">
                          Location
                        </span>
                        <p className="text-base font-medium text-[var(--event-text-main)] leading-relaxed font-sans">
                          {data.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {data.note && (
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)] text-sm text-[var(--event-text-main)]">
                    <Info className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-sans text-sm sm:text-base">{data.note}</p>
                  </div>
                )}

                {data.mapsLink && (
                  <div className="pt-2 font-sans">
                    <a
                      href={data.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 py-3 px-6 bg-[var(--event-primary)] hover:bg-[var(--event-primary-hover)] text-[var(--event-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-[var(--event-shadow-paper-sm)] template-focus-ring cursor-pointer min-h-[44px]"
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
    </section>
  );
}

export const ReceptionSection = SecondaryEventSection;
