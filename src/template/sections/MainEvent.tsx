import type { MainEventData } from "@/platform/event-template-data";
import {
  formatEventDateLong,
  formatTimeRange,
  formatRsvpDeadline,
} from "@/template/utils/event-formatting";
import { DateCalendar } from "@/template/components/interactive/DateCalendar";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Calendar, Clock, AlertCircle, Bookmark } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Strictly uses connected ceremony / main_event fields only (no venue/address borrowing).

export type MainEventSectionProps = {
  data: MainEventData;
};

export type CeremonySectionProps = MainEventSectionProps;

export function MainEventSection({ data }: MainEventSectionProps) {
  const eventLabel = data.eventLabel || "The Celebration";
  const dateFormatted = formatEventDateLong(data.eventDate);
  const timeFormatted = formatTimeRange(data.eventTime, data.endTime);
  const deadlineFormatted = formatRsvpDeadline(data.rsvpDeadline);

  return (
    <section
      id="main_event"
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="text-role-subheading">FOLIO // 02 &bull; MAIN EVENT</span>
            <h2 className="text-role-heading-major text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {eventLabel}
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={24} delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Interactive Month Calendar */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative overflow-visible bg-[var(--event-surface)] rounded-2xl p-5 sm:p-6 border-2 border-[var(--event-border)] shadow-[var(--event-shadow-paper-md)]">
                <div className="relative z-10">
                  <DateCalendar
                    date={data.eventDate || undefined}
                    highlightLabel={data.eventLabel || "The Celebration"}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Formal Estate Ceremony Record */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="relative overflow-visible h-full">
                <LedgerPanel
                  title="Official Event Record"
                  indexTag="RECORD // 01"
                  className="h-full bg-[var(--event-surface)] flex flex-col justify-between relative z-10"
                >
                  <div className="space-y-5 pt-2 font-sans">
                    {/* Date & Time Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dateFormatted && (
                        <div className="p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-role-metadata text-[var(--event-primary)]">
                            <Calendar className="w-3.5 h-3.5 text-[var(--event-primary)]" />
                            <span>Date</span>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-[var(--event-text-main)] font-sans">
                            {dateFormatted}
                          </p>
                        </div>
                      )}

                      {timeFormatted && (
                        <div className="p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-role-metadata text-[var(--event-primary)]">
                            <Clock className="w-3.5 h-3.5 text-[var(--event-primary)]" />
                            <span>Time</span>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-[var(--event-text-main)] font-sans">
                            {timeFormatted}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* RSVP Deadline */}
                    {deadlineFormatted && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--event-accent-soft)] border border-[var(--event-accent)] text-sm">
                        <Bookmark className="w-4 h-4 text-[var(--event-accent)] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--event-text-main)] font-mono uppercase tracking-wider text-[11px] block">
                            Response Requested
                          </span>
                          <span className="text-[var(--event-text-main)] font-medium">
                            Kindly respond by {deadlineFormatted}
                          </span>
                        </div>
                      </div>
                    )}

                    {data.scheduleNote && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)] text-sm text-[var(--event-text-main)]">
                        <AlertCircle className="w-4 h-4 text-[var(--event-primary)] shrink-0 mt-0.5" />
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
    </section>
  );
}

export const CeremonySection = MainEventSection;
