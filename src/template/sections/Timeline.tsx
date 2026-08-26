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
      className="template-section bg-pattern-heroic-01 min-h-[500px] h-auto relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="comic-badge comic-badge-gold">TIMELINE // MISSION SCHEDULE</span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "Timeline"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed text-slate-300">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        {/* Architectural Continuous Rail */}
        <div className="relative max-w-2xl mx-auto pl-6 sm:pl-8 border-l-4 border-[var(--event-primary)] font-sans">
          <StaggerList staggerDelay={0.08} className="space-y-4 sm:space-y-6">
            {data.items.map((item, idx: number) => (
              <div key={item.id || idx} className="relative group">
                {/* Diamond Milestone Node */}
                <div className="absolute -left-[33px] sm:-left-[41px] top-2 w-4 h-4 bg-amber-400 border-2 border-slate-950 rotate-45 group-hover:scale-110 transition-all duration-300 shadow-[2px_2px_0px_#0f172a] z-10" />

                <div className="relative overflow-visible bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-950 shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] transition-all">
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b-2 border-slate-100">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-950">
                        {item.title}
                      </h3>
                      {item.time && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-300 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]">
                          <Clock className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                          <span>{formatEventTime(item.time)}</span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans font-medium">
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
