"use client";

import { useState } from "react";
import type { GiftsData } from "@/platform/wedding-template-data";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { LedgerPanel } from "@/template/components/containers/LedgerPanel";
import { Reveal } from "@/template/components/motion/Reveal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/template/components/ui/Dialog";
import { QrCode } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE GIFT DETAILS & REGISTRY (THE GLASSHOUSE LEDGER)
// Gift Details & Monetary Gift options (Max 2 options).

export function GiftsSection({ data }: { data: GiftsData }) {
  const options = (data.options || []).slice(0, 2);
  const [zoomImage, setZoomImage] = useState<{ title: string; url: string } | null>(null);

  if (!data.giftNote && !data.sectionIntro && options.length === 0) return null;

  return (
    <section
      id="gift_details"
      className="template-section section-surface-ivory pattern-archival-dot pattern-subtle relative overflow-x-clip"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading">FOLIO // 12 &bull; GIFT REGISTRY</span>
            <h2 className="text-role-heading-quiet text-[var(--wedding-text)] tracking-tight">
              Gift Details
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-lg mx-auto mt-2 leading-relaxed">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            {/* Botanical Corner Pair on Registry Guidance Outer Panel */}
            <BotanicalCornerPair size="md" />

            <LedgerPanel
              title="Registry Guidance"
              indexTag="GIFTS // FOLIO"
              headerAlign="center"
              className="max-w-2xl mx-auto bg-[var(--wedding-surface)] shadow-card space-y-6 relative z-10"
            >
              {data.giftNote && (
                <p className="text-base sm:text-lg text-[var(--wedding-text)] leading-relaxed text-center italic font-serif max-w-md mx-auto">
                  &ldquo;{data.giftNote}&rdquo;
                </p>
              )}

              {options.length > 0 && (
                <div className="border-t border-[var(--wedding-border-subtle)] pt-5 font-sans">
                  <span className="text-role-metadata text-[var(--wedding-accent)] block mb-4 text-center">
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
                        className="p-5 rounded-2xl border border-[var(--wedding-border)] bg-[var(--wedding-surface-alt)] text-center shadow-xs space-y-3"
                      >
                        <span className="font-serif font-bold text-[var(--wedding-text)] block text-lg">
                          {opt.title}
                        </span>
                        {opt.image?.url && (
                          <div
                            className="mt-2 inline-block p-3 bg-[var(--wedding-surface)] rounded-2xl border border-[var(--wedding-border)] shadow-xs cursor-pointer group hover:border-[var(--wedding-primary)] transition-all"
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
                            <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] font-mono text-[var(--wedding-text-muted)] group-hover:text-[var(--wedding-primary)]">
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
            <DialogContent className="max-w-sm p-6 bg-[var(--wedding-surface)] border-[var(--wedding-border)] text-center">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl text-[var(--wedding-text)]">
                  {zoomImage.title}
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-white rounded-2xl border border-[var(--wedding-border)] mt-3 inline-block">
                <img
                  src={zoomImage.url}
                  alt={zoomImage.title}
                  className="w-64 h-64 object-contain mx-auto rounded"
                />
              </div>
              <p className="text-xs text-[var(--wedding-text-muted)] font-mono mt-3">
                Scan using your banking or e-wallet application
              </p>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
