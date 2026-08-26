import type { VenueData } from "@/platform/event-template-data";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { Reveal } from "@/template/components/motion/Reveal";
import { MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC. DO NOT HARDCODE.

export function VenueSection({ data }: { data: VenueData }) {
  return (
    <section
      id="venue"
      className="template-section bg-pattern-heroic-01 relative overflow-x-clip bg-[var(--event-bg,#0f172a)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="comic-badge comic-badge-gold">MISSION // 03 • HEADQUARTERS</span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "The Venue"}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column: HQ Exterior Specimen Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[480px] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
              <SpecimenFrame
                src={data.photoUrl}
                alt={data.venueName || "Event HQ"}
                caption={data.venueName ? `HQ: ${data.venueName}` : "HQ Command Center"}
                specimenNumber="HQ EXTERIOR // COORD 01"
                aspectRatio="widescreen"
                className="bg-white border-[3.5px] border-slate-950 shadow-[8px_8px_0px_#0f172a] rounded-2xl"
              >
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-900 text-white h-full min-h-[200px]">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-[3px_3px_0px_#0f172a]">
                    <MapPin className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-400">
                    {data.venueName || "STARK TOWER PLAY ARENA"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    [ COORDINATES VERIFIED • MISSION HQ ]
                  </span>
                </div>
              </SpecimenFrame>
            </div>
          </div>

          {/* Right Column: Structured Coordinates Ledger */}
          <div className="lg:col-span-6">
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
        </div>
      </div>
    </section>
  );
}
