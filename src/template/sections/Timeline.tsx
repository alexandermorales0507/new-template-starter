import type { TimelineData } from "@/platform/event-template-data";
import { formatEventTime } from "@/template/utils/event-formatting";
import { StaggerList } from "@/template/components/motion/StaggerList";
import { Reveal } from "@/template/components/motion/Reveal";
import { Clock } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.

export function TimelineSection({ data }: { data: TimelineData }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <section
      id="timeline_program"
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              FOLIO // 06 &bull; SCHEDULE OF EVENTS
            </span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "Timeline"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed text-[var(--event-on-dark-muted,#94a3b8)]">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        {/* Architectural Continuous Rail */}
        <div className="relative max-w-2xl mx-auto pl-6 sm:pl-8 border-l-2 border-[var(--event-primary)] font-sans">
          <StaggerList staggerDelay={0.08} className="space-y-4 sm:space-y-6">
            {data.items.map((item, idx: number) => (
              <div key={item.id || idx} className="relative group">
                {/* Diamond Milestone Node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 bg-[var(--event-accent)] border-2 border-[var(--event-border)] rotate-45 group-hover:scale-110 transition-all duration-300 shadow-[var(--event-shadow-paper-sm)] z-10" />

                <div className="relative overflow-visible bg-[var(--event-surface)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--event-border)] shadow-[var(--event-shadow-paper-md)] hover:shadow-[var(--event-shadow-paper-lg)] transition-all">
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[var(--event-border-subtle)]">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--event-text-main)]">
                        {item.title}
                      </h3>
                      {item.time && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--event-surface-caption)] text-[var(--event-text-main)] font-mono text-xs font-bold uppercase tracking-wider border border-[var(--event-border)]">
                          <Clock className="w-3.5 h-3.5 text-[var(--event-primary)]" />
                          <span>{formatEventTime(item.time)}</span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm sm:text-base text-[var(--event-text-main)] leading-relaxed font-sans">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </StaggerList>
        </div>
      </div>
    </section>
  );
}
