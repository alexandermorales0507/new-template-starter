import type { TimelineData } from "@/platform/wedding-template-data";
import { formatEventTime } from "@/template/utils/event-formatting";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { StaggerList } from "@/template/components/motion/StaggerList";
import { Reveal } from "@/template/components/motion/Reveal";
import { Clock } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE ARCHITECTURAL TIMELINE RAIL (THE GLASSHOUSE LEDGER)

export function TimelineSection({ data }: { data: TimelineData }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <section
      id="timeline_program"
      className="template-section section-surface-ivory pattern-ledger-rule pattern-standard relative overflow-x-clip"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="text-role-subheading">FOLIO // 06 &bull; SCHEDULE OF EVENTS</span>
            <h2 className="text-role-heading text-[var(--wedding-text)] tracking-tight">
              {data.sectionTitle || "Timeline"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        {/* Architectural Continuous Rail */}
        <div className="relative max-w-2xl mx-auto pl-6 sm:pl-8 border-l-2 border-[var(--wedding-border)] font-sans">
          <StaggerList staggerDelay={0.08} className="space-y-4 sm:space-y-6">
            {data.items.map((item, idx: number) => (
              <div key={item.id || idx} className="relative group">
                {/* Diamond Milestone Node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 bg-[var(--wedding-surface)] border-2 border-[var(--wedding-primary)] rotate-45 group-hover:bg-[var(--wedding-primary)] group-hover:rotate-90 transition-all duration-300 shadow-xs z-10" />

                <div className="relative overflow-visible bg-[var(--wedding-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--wedding-border)] shadow-xs hover:border-[var(--wedding-accent)]/60 transition-colors">
                  {/* Botanical Corner Pair on Timeline Card */}
                  <BotanicalCornerPair size="sm" />

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[var(--wedding-border-subtle)]">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--wedding-text)]">
                        {item.title}
                      </h3>
                      {item.time && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--wedding-surface-alt)] text-[var(--wedding-text)] font-mono text-xs font-bold uppercase tracking-wider border border-[var(--wedding-border-subtle)]">
                          <Clock className="w-3.5 h-3.5 text-[var(--wedding-primary)]" />
                          <span>{formatEventTime(item.time)}</span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm sm:text-base text-[var(--wedding-text)] leading-relaxed font-sans">
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
