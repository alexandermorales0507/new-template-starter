import type { ReceptionData } from "@/platform/wedding-template-data";
import { formatTimeRange } from "@/template/utils/event-formatting";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Clock, MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE RECEPTION (THE GLASSHOUSE LEDGER)

export type ReceptionSectionProps = {
  data: ReceptionData;
  eventDate?: string | null;
};

export function ReceptionSection({ data }: ReceptionSectionProps) {
  const timeFormatted = formatTimeRange(data.startTime, data.endTime);
  const title = data.title || "The Reception";

  return (
    <section
      id="secondary_event"
      className="template-section section-surface-forest pattern-glazing-grid pattern-subtle pattern-dark relative overflow-x-clip"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading text-[var(--wedding-accent-soft)]">
              FOLIO // 05 &bull; RECEPTION
            </span>
            <h2 className="text-role-heading text-[var(--wedding-on-dark)] tracking-tight">
              {title}
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <BotanicalCornerPair size="md" />
            <LedgerPanel
              title={data.venueName || "Reception Grounds"}
              indexTag="RECORD // 02"
              className="bg-[var(--wedding-surface)] text-[var(--wedding-text)] shadow-card relative z-10"
            >
              <div className="space-y-4 pt-1 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {timeFormatted && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)]">
                      <Clock className="w-5 h-5 text-[var(--wedding-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--wedding-text-muted)] block mb-0.5">
                          Program Hours
                        </span>
                        <p className="text-base sm:text-lg font-bold text-[var(--wedding-text)] font-serif">
                          {timeFormatted}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.address && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)]">
                      <MapPin className="w-5 h-5 text-[var(--wedding-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--wedding-text-muted)] block mb-0.5">
                          Location
                        </span>
                        <p className="text-base font-medium text-[var(--wedding-text)] leading-relaxed font-sans">
                          {data.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {data.note && (
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)] text-sm text-[var(--wedding-text)]">
                    <Info className="w-5 h-5 text-[var(--wedding-primary)] shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-sans text-sm sm:text-base">{data.note}</p>
                  </div>
                )}

                {data.mapsLink && (
                  <div className="pt-2 font-sans">
                    <a
                      href={data.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 py-3 px-6 bg-[var(--wedding-primary)] hover:bg-[var(--wedding-primary-hover)] text-[var(--wedding-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-xs template-focus-ring cursor-pointer min-h-[44px]"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Reception Directions</span>
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
