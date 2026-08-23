import type { SponsorsData } from "@/platform/event-template-data";
import { sageDecorations } from "@/template/template-assets";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { DecorativePattern } from "@/template/components/decorations/DecorativePattern";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE FORMAL PATRON REGISTER (QUIET SECTION)

function parseSponsorNames(rawNames: string): string[] {
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

export function SponsorsSection({ data }: { data: SponsorsData }) {
  const names = parseSponsorNames(data.names || "");
  if (names.length === 0) return null;

  return (
    <section
      id="principal_sponsors"
      className="template-section section-surface-paper relative overflow-x-clip"
    >
      {/* Decorative Glasshouse Grid Pattern Background (Architectural Ledger Paper) */}
      <DecorativePattern
        src={sageDecorations.glasshouseGridPattern}
        opacity={0.28}
        objectPosition="center top"
        blendMode="multiply"
      />

      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading">FOLIO // 08 &bull; PRINCIPAL SPONSORS</span>
            <h2 className="text-role-heading-quiet text-[var(--event-text)] tracking-tight">
              Principal Sponsors
            </h2>
            {data.introLine && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed">
                {data.introLine}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            {/* Botanical Corner Pair on Sponsors Register Card */}
            <BotanicalCornerPair size="md" />

            <LedgerPanel
              title="Roll of Principal Sponsors"
              indexTag="OFFICIAL REGISTER"
              headerAlign="center"
              className="bg-[var(--event-surface)] shadow-xs relative z-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2 font-sans">
                {names.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-2.5 border-b border-[var(--event-border-subtle)] text-base font-medium text-[var(--event-text)] font-sans"
                  >
                    <span className="w-2 h-2 rotate-45 bg-[var(--event-accent)] shrink-0" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </LedgerPanel>
          </div>
        </Reveal>
      </div>

      {/* Boundary Threshold Divider: Sponsors -> Attire */}
      <SectionFloralDivider />
    </section>
  );
}
