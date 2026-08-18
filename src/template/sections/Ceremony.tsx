import type { CeremonyData } from "@/platform/wedding-template-data";
import {
  formatEventDateLong,
  formatTimeRange,
  formatRsvpDeadline,
} from "@/template/utils/event-formatting";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { DateCalendar } from "@/template/components/interactive/DateCalendar";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Calendar, Clock, AlertCircle, Bookmark } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE CEREMONY (THE GLASSHOUSE LEDGER SIGNATURE PEAK)
// Strictly uses connected ceremony fields only (no venue/address borrowing).

export function CeremonySection({ data }: { data: CeremonyData }) {
  const eventLabel = data.eventLabel || "The Ceremony";
  const dateFormatted = formatEventDateLong(data.eventDate);
  const timeFormatted = formatTimeRange(data.eventTime, data.endTime);
  const deadlineFormatted = formatRsvpDeadline(data.rsvpDeadline);

  return (
    <section
      id="main_event"
      className="template-section section-surface-ivory pattern-ledger-rule pattern-standard relative overflow-x-clip"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="text-role-subheading">FOLIO // 02 &bull; CEREMONY</span>
            <h2 className="text-role-heading-major text-[var(--wedding-text)] tracking-tight">
              {eventLabel}
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={24} delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Interactive Month Calendar */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative overflow-visible bg-[var(--wedding-surface)] rounded-2xl p-5 sm:p-6 border border-[var(--wedding-border)] shadow-xs">
                <BotanicalCornerPair size="md" />
                <div className="relative z-10">
                  <DateCalendar
                    date={data.eventDate || undefined}
                    highlightLabel={data.eventLabel || "The Ceremony"}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Formal Estate Ceremony Record */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="relative overflow-visible h-full">
                <BotanicalCornerPair size="md" />
                <LedgerPanel
                  title="Official Ceremony Record"
                  indexTag="RECORD // 01"
                  className="h-full bg-[var(--wedding-surface)] flex flex-col justify-between relative z-10"
                >
                  <div className="space-y-5 pt-2 font-sans">
                    {/* Date & Time Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dateFormatted && (
                        <div className="p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-role-metadata text-[var(--wedding-accent-strong,#8f6a2c)]">
                            <Calendar className="w-3.5 h-3.5 text-[var(--wedding-primary)]" />
                            <span>Date</span>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-[var(--wedding-text)] font-serif">
                            {dateFormatted}
                          </p>
                        </div>
                      )}

                      {timeFormatted && (
                        <div className="p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-role-metadata text-[var(--wedding-accent-strong,#8f6a2c)]">
                            <Clock className="w-3.5 h-3.5 text-[var(--wedding-primary)]" />
                            <span>Time</span>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-[var(--wedding-text)] font-serif">
                            {timeFormatted}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* RSVP Deadline */}
                    {deadlineFormatted && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--wedding-accent-soft)]/40 border border-[var(--wedding-accent)]/50 text-sm">
                        <Bookmark className="w-4 h-4 text-[var(--wedding-accent)] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--wedding-text)] font-mono uppercase tracking-wider text-[11px] block">
                            Response Requested
                          </span>
                          <span className="text-[var(--wedding-text)] font-medium">
                            Kindly respond by {deadlineFormatted}
                          </span>
                        </div>
                      </div>
                    )}

                    {data.scheduleNote && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)] text-sm text-[var(--wedding-text)]">
                        <AlertCircle className="w-4 h-4 text-[var(--wedding-primary)] shrink-0 mt-0.5" />
                        <p className="leading-relaxed font-sans">{data.scheduleNote}</p>
                      </div>
                    )}
                  </div>
                </LedgerPanel>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Boundary Threshold Divider: Ceremony -> Venue */}
      <SectionFloralDivider />
    </section>
  );
}
