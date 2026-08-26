import type { GuestbookData } from "@/platform/event-template-data";
import { formatGuestbookDate } from "@/template/utils/event-formatting";
import { StaggerList } from "@/template/components/motion/StaggerList";
import { Reveal } from "@/template/components/motion/Reveal";
import { MessageSquare, Sparkles } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.

export function GuestbookSection({ data }: { data: GuestbookData }) {
  const messages = data.messages || [];

  return (
    <section
      id="guestbook"
      className="template-section bg-pattern-heroic-01 min-h-[500px] h-auto relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <span className="comic-badge comic-badge-gold">HERO LOG // WISHES &amp; MESSAGES</span>
            <h2 className="text-role-heading-quiet text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "Wishes & Blessings"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed text-slate-300">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        {messages.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <StaggerList staggerDelay={0.08} className="space-y-4 sm:space-y-5">
              {messages.map((msg, idx: number) => {
                const formattedDate = formatGuestbookDate(msg.submittedAt || msg.approvedAt);

                return (
                  <div
                    key={msg.id || idx}
                    className="relative overflow-visible bg-white p-6 sm:p-7 rounded-2xl border-2 border-slate-950 shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] transition-all space-y-4 font-sans"
                  >
                    <div className="relative z-10 space-y-4">
                      <p className="text-slate-900 italic leading-relaxed text-base sm:text-lg font-sans">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                      <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-200 font-mono">
                        <span className="font-serif font-bold text-slate-950 text-base not-italic flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[var(--event-primary)] fill-current" />
                          {msg.guestName || "Guest"}
                        </span>
                        {formattedDate && <span className="text-[11px]">{formattedDate}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggerList>
          </div>
        ) : (
          <Reveal direction="up" distance={16}>
            <div className="bg-[var(--event-surface)] p-8 sm:p-10 rounded-2xl border-2 border-dashed border-[var(--event-border)] text-center max-w-md mx-auto shadow-[var(--event-shadow-paper-sm)]">
              <MessageSquare className="w-8 h-8 text-[var(--event-primary)] mx-auto mb-3 opacity-60" />
              <p className="text-base text-[var(--event-text-muted)] leading-relaxed font-sans">
                {data.emptyStateMessage ||
                  "Approved guest messages will be mounted in the archive here."}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
