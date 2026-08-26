import type { VenueData } from "@/platform/event-template-data";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC. DO NOT HARDCODE.

export function VenueSection({ data }: { data: VenueData }) {
  return (
    <section
      id="venue"
      className="template-section relative overflow-x-clip bg-[var(--event-bg,#0f172a)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="comic-badge comic-badge-gold">MISSION // 03 • HEADQUARTERS</span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "The Venue"}
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={24} delay={0.1}>
          <div className="max-w-2xl mx-auto">
            <LedgerPanel
              title={data.venueName || "HQ Location"}
              indexTag="COORDINATES // 01"
              className="bg-[var(--event-surface)] relative z-10 shadow-[8px_8px_0px_#0f172a] border-[3px] border-slate-950 rounded-2xl"
            >
              <div className="space-y-4 pt-1 font-sans">
                {data.address && (
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border-2 border-slate-900">
                    <MapPin className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-role-metadata text-slate-600 block mb-0.5 font-bold">
                        Official Address
                      </span>
                      <p className="text-base font-medium text-slate-950 leading-relaxed font-sans">
                        {data.address}
                      </p>
                    </div>
                  </div>
                )}

                {data.arrivalNote && (
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border-2 border-slate-900 text-sm text-slate-950">
                    <Info className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-role-metadata text-slate-600 block mb-0.5 font-bold">
                        Arrival Guidance
                      </span>
                      <p className="leading-relaxed font-sans text-sm sm:text-base">
                        {data.arrivalNote}
                      </p>
                    </div>
                  </div>
                )}

                {data.mapsLink && (
                  <div className="pt-2 font-sans text-center sm:text-left">
                    <a
                      href={data.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="comic-button comic-button-primary inline-flex items-center gap-2.5 py-3 px-6 text-white text-sm font-bold min-h-[44px] border-[2.5px] border-slate-950 shadow-[4px_4px_0px_#0f172a]"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>OPEN IN GOOGLE MAPS</span>
                    </a>
                  </div>
                )}
              </div>
            </LedgerPanel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
