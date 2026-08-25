"use client";

import { useState } from "react";
import type { GiftsData } from "@/platform/event-template-data";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/template/components/ui/Dialog";
import { QrCode } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Gift Details & Monetary Gift options (Max 2 options).

export function GiftsSection({ data }: { data: GiftsData }) {
  const options = (data.options || []).slice(0, 2);
  const [zoomImage, setZoomImage] = useState<{ title: string; url: string } | null>(null);

  if (!data.giftNote && !data.sectionIntro && options.length === 0) return null;

  return (
    <section
      id="gift_details"
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              FOLIO // 12 &bull; GIFT REGISTRY
            </span>
            <h2 className="text-role-heading-quiet text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              Gift Details
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-lg mx-auto mt-2 leading-relaxed text-[var(--event-on-dark-muted,#94a3b8)]">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <LedgerPanel
              title="Registry Guidance"
              indexTag="GIFTS // FOLIO"
              headerAlign="center"
              className="max-w-2xl mx-auto bg-[var(--event-surface)] text-[var(--event-text-main)] shadow-[var(--event-shadow-paper-md)] space-y-6 relative z-10"
            >
              {data.giftNote && (
                <p className="text-base sm:text-lg text-[var(--event-text-main)] leading-relaxed text-center italic font-sans max-w-md mx-auto">
                  &ldquo;{data.giftNote}&rdquo;
                </p>
              )}

              {options.length > 0 && (
                <div className="border-t border-[var(--event-border-subtle)] pt-5 font-sans">
                  <span className="text-role-metadata text-[var(--event-primary)] block mb-4 text-center">
                    Available Contribution Channels
                  </span>
                  <div
                    className={`grid grid-cols-1 ${
                      options.length === 2 ? "sm:grid-cols-2" : ""
                    } gap-4 sm:gap-6 max-w-xl mx-auto`}
                  >
                    {options.map((opt) => (
                      <div
                        key={opt.id}
                        className="p-5 rounded-2xl border-2 border-[var(--event-border)] bg-[var(--event-surface-alt)] text-center shadow-[var(--event-shadow-paper-sm)] space-y-3"
                      >
                        <span className="font-serif font-bold text-[var(--event-text-main)] block text-lg">
                          {opt.title}
                        </span>
                        {opt.image?.url && (
                          <div
                            className="mt-2 inline-block p-3 bg-[var(--event-surface)] rounded-2xl border-2 border-[var(--event-border)] shadow-[var(--event-shadow-paper-sm)] cursor-pointer group hover:border-[var(--event-primary)] transition-all"
                            onClick={() => {
                              if (opt.image?.url) {
                                setZoomImage({
                                  title: opt.title || "Contribution Channel",
                                  url: opt.image.url,
                                });
                              }
                            }}
                            title="Click to enlarge QR code"
                          >
                            <img
                              src={opt.image.url}
                              alt={opt.image.alt || `${opt.title} QR`}
                              className="w-40 h-40 object-contain mx-auto rounded-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] font-mono text-[var(--event-text-muted)] group-hover:text-[var(--event-primary)]">
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Tap to enlarge</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </LedgerPanel>
          </div>
        </Reveal>

        {/* QR Zoom Lightbox Dialog */}
        {zoomImage && (
          <Dialog open={Boolean(zoomImage)} onOpenChange={() => setZoomImage(null)}>
            <DialogContent className="max-w-sm p-6 bg-[var(--event-surface)] border-[var(--event-border)] text-center">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl text-[var(--event-text-main)]">
                  {zoomImage.title}
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-white rounded-2xl border-2 border-[var(--event-border)] mt-3 inline-block">
                <img
                  src={zoomImage.url}
                  alt={zoomImage.title}
                  className="w-64 h-64 object-contain mx-auto rounded"
                />
              </div>
              <p className="text-xs text-[var(--event-text-muted)] font-mono mt-3">
                Scan using your banking or e-wallet application
              </p>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
