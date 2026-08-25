import type { VenueData } from "@/platform/event-template-data";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.

export function VenueSection({ data }: { data: VenueData }) {
  const venuePhoto = templateAssets.photos.venue;

  return (
    <section
      id="venue"
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
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

        <Reveal direction="up" distance={24} delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Mounted Venue Grounds Frame (Undecorated) */}
            <div className="lg:col-span-6">
              <SpecimenFrame
                src={venuePhoto}
                alt={data.venueName || "Event Venue"}
                caption={data.venueName ? `HQ Grounds: ${data.venueName}` : "HQ Grounds"}
                specimenNumber="HQ VIEW // 03"
                aspectRatio="landscape"
                className="shadow-[var(--event-shadow-paper-md)] bg-[var(--event-surface)]"
              />
            </div>

            {/* Right Column: Structured Venue Record */}
            <div className="lg:col-span-6">
              <div className="relative overflow-visible">
                <LedgerPanel
                  title={data.venueName || "HQ Location"}
                  indexTag="COORDINATES // 01"
                  className="bg-[var(--event-surface)] relative z-10"
                >
                  <div className="space-y-4 pt-1 font-sans">
                    {data.address && (
                      <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)]">
                        <MapPin className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-role-metadata text-[var(--event-text-muted)] block mb-0.5">
                            Official Address
                          </span>
                          <p className="text-base font-medium text-[var(--event-text-main)] leading-relaxed font-sans">
                            {data.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.arrivalNote && (
                      <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--event-surface-alt)] border border-[var(--event-border-subtle)] text-sm text-[var(--event-text-main)]">
                        <Info className="w-5 h-5 text-[var(--event-primary)] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-role-metadata text-[var(--event-text-muted)] block mb-0.5">
                            Arrival Guidance
                          </span>
                          <p className="leading-relaxed font-sans text-sm sm:text-base">
                            {data.arrivalNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.mapsLink && (
                      <div className="pt-2 font-sans">
                        <a
                          href={data.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 py-3 px-6 bg-[var(--event-primary)] hover:bg-[var(--event-primary-hover)] text-[var(--event-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-[var(--event-shadow-paper-sm)] template-focus-ring cursor-pointer min-h-[44px]"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Get Driving Directions</span>
                        </a>
                      </div>
                    )}
                  </div>
                </LedgerPanel>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
