import Image from "next/image";
import type { SponsorsData } from "@/platform/wedding-template-data";
import { sageDecorations } from "@/template/template-assets";
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
    <section id="principal_sponsors" className="template-section section-surface-paper">
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            {/* Archival Patron Crest */}
            <div className="flex justify-center mb-1.5" aria-hidden="true">
              <Image
                src={sageDecorations.ledgerCrest}
                alt=""
                width={84}
                height={84}
                className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain select-none pointer-events-none opacity-90"
              />
            </div>

            <span className="text-role-subheading">FOLIO // 08 &bull; PRINCIPAL SPONSORS</span>
            <h2 className="text-role-heading-quiet text-[var(--wedding-text)] tracking-tight">
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
          <LedgerPanel
            title="Roll of Principal Sponsors"
            indexTag="OFFICIAL REGISTER"
            headerAlign="center"
            className="bg-[var(--wedding-surface)] shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2 font-sans">
              {names.map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 py-2.5 border-b border-[var(--wedding-border-subtle)] text-base font-medium text-[var(--wedding-text)] font-sans"
                >
                  <span className="w-2 h-2 rotate-45 bg-[var(--wedding-accent)] shrink-0" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </LedgerPanel>
        </Reveal>
      </div>
    </section>
  );
}
