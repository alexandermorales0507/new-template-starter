import type { VenueData } from "@/platform/wedding-template-data";
import { templateAssets } from "@/template/template-assets";
import { SpecimenFrame } from "@/template/components/containers/SpecimenFrame";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { MapPin, Navigation, Info } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE VENUE LOCATION (THE GLASSHOUSE LEDGER)

export function VenueSection({ data }: { data: VenueData }) {
  const venuePhoto = templateAssets.photos.venue;

  return (
    <section
      id="venue"
      className="template-section section-surface-sage pattern-glazing-grid pattern-subtle"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="text-role-subheading">FOLIO // 03 &bull; THE GROUNDS</span>
            <h2 className="text-role-heading text-[var(--wedding-text)] tracking-tight">
              The Venue
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={24} delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Mounted Venue Grounds Frame */}
            <div className="lg:col-span-6">
              <SpecimenFrame
                src={venuePhoto}
                alt={data.venueName || "Wedding Venue"}
                caption={data.venueName ? `Estate Grounds: ${data.venueName}` : "Estate Grounds"}
                specimenNumber="ESTATE VIEW // 03"
                aspectRatio="landscape"
                className="shadow-soft bg-[var(--wedding-surface)]"
              />
            </div>

            {/* Right Column: Structured Venue Record */}
            <div className="lg:col-span-6">
              <LedgerPanel
                title={data.venueName || "Estate Location"}
                indexTag="VENUE // RECORD"
                className="bg-[var(--wedding-surface)]"
              >
                <div className="space-y-4 pt-1 font-sans">
                  {data.address && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)]">
                      <MapPin className="w-5 h-5 text-[var(--wedding-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--wedding-text-muted)] block mb-0.5">
                          Official Address
                        </span>
                        <p className="text-base font-medium text-[var(--wedding-text)] leading-relaxed font-sans">
                          {data.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.arrivalNote && (
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--wedding-surface-alt)] border border-[var(--wedding-border-subtle)] text-sm text-[var(--wedding-text)]">
                      <Info className="w-5 h-5 text-[var(--wedding-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-role-metadata text-[var(--wedding-text-muted)] block mb-0.5">
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
                        className="inline-flex items-center gap-2.5 py-3 px-6 bg-[var(--wedding-primary)] hover:bg-[var(--wedding-primary-hover)] text-[var(--wedding-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-xs template-focus-ring cursor-pointer min-h-[44px]"
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
        </Reveal>
      </div>
    </section>
  );
}
