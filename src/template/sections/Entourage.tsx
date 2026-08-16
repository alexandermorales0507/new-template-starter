import type { EntourageData } from "@/platform/wedding-template-data";
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
    <section id="entourage" className="template-section section-surface-sage">
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="text-role-subheading">FOLIO // 07 &bull; THE ENTOURAGE</span>
            <h2 className="text-role-heading-quiet text-[var(--wedding-text)] tracking-tight">
              The Entourage
            </h2>
            {data.introLine && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed">
                {data.introLine}
              </p>
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validGroups.map((group, gIdx) => {
            const names = parseEntourageNames(group.names);

            return (
              <Reveal key={group.id || gIdx} direction="up" distance={20} delay={gIdx * 0.05}>
                <LedgerPanel
                  title={group.groupTitle || "Wedding Party"}
                  indexTag={`ROLE // 0${gIdx + 1}`}
                  className="h-full bg-[var(--wedding-surface)] hover:border-[var(--wedding-accent)]/50 transition-colors shadow-xs text-center"
                >
                  <ul className="space-y-2.5 pt-1 font-sans">
                    {names.map((name, nIdx) => (
                      <li
                        key={nIdx}
                        className="text-base font-semibold text-[var(--wedding-text)] font-serif border-b border-[var(--wedding-border-subtle)] pb-2 last:border-0 last:pb-0"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </LedgerPanel>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
