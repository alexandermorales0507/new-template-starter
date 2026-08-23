import type { AttireData } from "@/platform/event-template-data";
import { templateConfig } from "@/template/template.config";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { Reveal } from "@/template/components/motion/Reveal";
import { Shirt, Sparkles } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE ATTIRE & PALETTE GUIDE (THE GLASSHOUSE LEDGER)
// Swatches come from templateConfig.palette (template-local).

export function AttireSection({ data }: { data: AttireData }) {
  const palette = templateConfig.palette || [];

  if (!data.dressCodeNote && !data.colorMotifNote && !data.sectionIntro && palette.length === 0) {
    return null;
  }

  return (
    <section
      id="attire_motif"
      className="template-section section-surface-ivory pattern-lattice pattern-standard relative overflow-x-clip"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <span className="text-role-subheading">FOLIO // 09 &bull; ATTIRE &amp; PALETTE</span>
            <h2 className="text-role-heading text-[var(--event-text,#24342c)] tracking-tight">
              Dress Code &amp; Palette
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            {/* Botanical Corner Pair on Attire Panel */}
            <BotanicalCornerPair size="md" />

            <div className="bg-[var(--event-surface,#fffdf7)] rounded-2xl border border-[var(--event-border,#c7cfbc)] p-6 sm:p-8 shadow-card space-y-6 font-sans relative z-10">
              {data.dressCodeNote && (
                <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[var(--event-surface-alt,#dde5d3)] border border-[var(--event-border-subtle,#e1e7d9)]">
                  <Shirt className="w-5 h-5 text-[var(--event-primary,#657a57)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-role-metadata text-[var(--event-text-muted,#5d695f)] block mb-1">
                      Dress Code Guidelines
                    </span>
                    <p className="text-base text-[var(--event-text,#24342c)] leading-relaxed font-sans">
                      {data.dressCodeNote}
                    </p>
                  </div>
                </div>
              )}

              {data.colorMotifNote && (
                <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[var(--event-surface-alt,#dde5d3)] border border-[var(--event-border-subtle,#e1e7d9)]">
                  <Sparkles className="w-5 h-5 text-[var(--event-accent,#8f6a2c)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-role-metadata text-[var(--event-text-muted,#5d695f)] block mb-1">
                      Motif &amp; Atmosphere
                    </span>
                    <p className="text-base text-[var(--event-text,#24342c)] leading-relaxed font-sans">
                      {data.colorMotifNote}
                    </p>
                  </div>
                </div>
              )}

              {palette.length > 0 && (
                <div className="pt-2 text-center">
                  <span className="text-role-metadata text-[var(--event-accent,#8f6a2c)] block mb-4">
                    Suggested Color Inspiration
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    {palette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group">
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform ring-1 ring-[var(--event-border,#c7cfbc)]"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-mono font-semibold text-[var(--event-text,#24342c)]">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Boundary Threshold Divider: Attire -> Extra Info */}
      <SectionFloralDivider />
    </section>
  );
}
