import type { EntourageData } from "@/platform/event-template-data";
import { sageDecorations } from "@/template/template-assets";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { DecorativePattern } from "@/template/components/decorations/DecorativePattern";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE ENTOURAGE REGISTER (THE GLASSHOUSE LEDGER)

function parseEntourageNames(rawNames: string): string[] {
  if (!rawNames || typeof rawNames !== "string") return [];

  const lines = rawNames
    .split(/\r?\n/)
    .map((n) => n.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  if (lines.length === 1 && lines[0].includes(",")) {
    return lines[0]
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
  }

  return lines;
}

export function EntourageSection({ data }: { data: EntourageData }) {
  if (!data.groups || data.groups.length === 0) return null;

  const validGroups = data.groups.filter((g) => {
    const title = (g.groupTitle || "").trim();
    const names = parseEntourageNames(g.names);
    return title.length > 0 || names.length > 0;
  });

  if (validGroups.length === 0) return null;

  return (
    <section
      id="entourage"
      className="template-section section-surface-sage relative overflow-x-clip"
    >
      {/* Decorative Parterre Trellis Pattern Background (Readable Strength) */}
      <DecorativePattern
        src={sageDecorations.parterreTrellisPattern}
        opacity={0.32}
        objectPosition="center center"
        blendMode="multiply"
      />

      <div className="template-container relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="text-role-subheading">FOLIO // 07 &bull; THE ENTOURAGE</span>
            <h2 className="text-role-heading-quiet text-[var(--event-text)] tracking-tight">
              The Entourage
            </h2>
            {data.introLine && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed">
                {data.introLine}
              </p>
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {validGroups.map((group, gIdx) => {
            const names = parseEntourageNames(group.names);

            return (
              <Reveal key={group.id || gIdx} direction="up" distance={20} delay={gIdx * 0.05}>
                <div className="relative overflow-visible h-full">
                  {/* Botanical Corner Pair on Entourage Card */}
                  <BotanicalCornerPair size="sm" />

                  <LedgerPanel
                    title={group.groupTitle || "Entourage Group"}
                    indexTag={`ROLE // 0${gIdx + 1}`}
                    className="h-full bg-[var(--event-surface)] hover:border-[var(--event-accent)]/50 transition-colors shadow-xs text-center relative z-10"
                  >
                    <ul className="space-y-2.5 pt-1 font-sans">
                      {names.map((name, nIdx) => (
                        <li
                          key={nIdx}
                          className="text-base font-semibold text-[var(--event-text)] font-serif border-b border-[var(--event-border-subtle)] pb-2 last:border-0 last:pb-0"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </LedgerPanel>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Boundary Threshold Divider: Entourage -> Sponsors */}
      <SectionFloralDivider />
    </section>
  );
}
