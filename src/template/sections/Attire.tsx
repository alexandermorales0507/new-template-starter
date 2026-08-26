import type { AttireData } from "@/platform/event-template-data";
import { templateConfig } from "@/template/template.config";
import { Reveal } from "@/template/components/motion/Reveal";
import { Shirt, Sparkles } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Swatches come from templateConfig.palette (template-local).

export function AttireSection({ data }: { data: AttireData }) {
  const palette = templateConfig.palette || [];

  if (!data.dressCodeNote && !data.colorMotifNote && !data.sectionIntro && palette.length === 0) {
    return null;
  }

  return (
    <section
      id="attire_motif"
      className="template-section bg-pattern-heroic-01 min-h-[480px] flex flex-col justify-center relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <span className="comic-badge comic-badge-gold">
              TACTICAL GEAR // COSTUME &amp; MOTIF
            </span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "Dress Code & Palette"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed text-slate-300">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <div className="bg-[var(--event-surface)] rounded-2xl border-2 border-[var(--event-border)] p-6 sm:p-8 shadow-[var(--event-shadow-paper-md)] space-y-6 font-sans relative z-10">
              {data.dressCodeNote && (
                <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)]">
                  <Shirt className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-role-metadata text-[var(--event-text-muted)] block mb-1">
                      Dress Code Guidelines
                    </span>
                    <p className="text-base text-[var(--event-text-main)] leading-relaxed font-sans">
                      {data.dressCodeNote}
                    </p>
                  </div>
                </div>
              )}

              {data.colorMotifNote && (
                <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)]">
                  <Sparkles className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-role-metadata text-[var(--event-text-muted)] block mb-1">
                      Motif &amp; Atmosphere
                    </span>
                    <p className="text-base text-[var(--event-text-main)] leading-relaxed font-sans">
                      {data.colorMotifNote}
                    </p>
                  </div>
                </div>
              )}

              {palette.length > 0 && (
                <div className="pt-2 text-center">
                  <span className="text-role-metadata text-[var(--event-primary)] block mb-4">
                    Suggested Color Inspiration
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    {palette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group">
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[var(--event-border)] shadow-[var(--event-shadow-paper-sm)] group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-mono font-semibold text-[var(--event-text-main)]">
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
    </section>
  );
}
