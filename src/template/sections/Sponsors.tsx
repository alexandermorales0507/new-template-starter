import type { SponsorsData } from "@/platform/event-template-data";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.

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
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              FOLIO // 08 &bull; PRINCIPAL SPONSORS
            </span>
            <h2 className="text-role-heading-quiet text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              Principal Sponsors
            </h2>
            {data.introLine && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed text-[var(--event-on-dark-muted,#94a3b8)]">
                {data.introLine}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <LedgerPanel
              title="Roll of Principal Sponsors"
              indexTag="OFFICIAL REGISTER"
              headerAlign="center"
              className="bg-[var(--event-surface)] text-[var(--event-text-main)] shadow-[var(--event-shadow-paper-md)] relative z-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2 font-sans">
                {names.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-2.5 border-b border-[var(--event-border-subtle)] text-base font-medium text-[var(--event-text-main)] font-sans"
                  >
                    <span className="w-2 h-2 rotate-45 bg-[var(--event-primary)] shrink-0" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </LedgerPanel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
