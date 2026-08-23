import type { GuestbookData } from "@/platform/event-template-data";
import { sageDecorations } from "@/template/template-assets";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { DecorativePattern } from "@/template/components/decorations/DecorativePattern";
import { formatGuestbookDate } from "@/template/utils/event-formatting";
import { StaggerList } from "@/template/components/motion/StaggerList";
import { Reveal } from "@/template/components/motion/Reveal";
import { MessageSquare, Heart } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE GUESTBOOK ARCHIVE (THE GLASSHOUSE LEDGER)

export function GuestbookSection({ data }: { data: GuestbookData }) {
  const messages = data.messages || [];

  return (
    <section
      id="guestbook"
      className="template-section section-surface-sage relative overflow-x-clip"
    >
      {/* Decorative Parterre Trellis Pattern Background (Readable Strength) */}
      <DecorativePattern
        src={sageDecorations.parterreTrellisPattern}
        opacity={0.32}
        objectPosition="center 65%"
        blendMode="multiply"
      />

      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <span className="text-role-subheading">FOLIO // 13 &bull; WORDS OF BLESSING</span>
            <h2 className="text-role-heading-quiet text-[var(--event-text)] tracking-tight">
              {data.sectionTitle || "Wishes & Blessings"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed">
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
                    className="relative overflow-visible bg-[var(--event-surface)] p-6 sm:p-7 rounded-2xl border border-[var(--event-border)] shadow-xs transition-shadow hover:shadow-soft space-y-4 font-sans"
                  >
                    {/* Botanical Corner Pair on Guest Message Card */}
                    <BotanicalCornerPair size="sm" />

                    <div className="relative z-10 space-y-4">
                      <p className="text-[var(--event-text)] italic leading-relaxed text-base sm:text-lg font-serif">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                      <div className="flex justify-between items-center text-xs text-[var(--event-text-muted)] pt-3 border-t border-[var(--event-border-subtle)] font-mono">
                        <span className="font-serif font-bold text-[var(--event-text)] text-base not-italic flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-[var(--event-accent)] fill-current" />
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
            <div className="bg-[var(--event-surface)] p-8 sm:p-10 rounded-2xl border border-dashed border-[var(--event-border)] text-center max-w-md mx-auto shadow-xs">
              <MessageSquare className="w-8 h-8 text-[var(--event-primary)] mx-auto mb-3 opacity-60" />
              <p className="text-base text-[var(--event-text-muted)] leading-relaxed font-sans">
                {data.emptyStateMessage ||
                  "Approved guest messages will be mounted in the archive here."}
              </p>
            </div>
          </Reveal>
        )}
      </div>

      {/* Boundary Threshold Divider: Guestbook -> Love Story */}
      <SectionFloralDivider />
    </section>
  );
}
