"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { GalleryData } from "@/platform/wedding-template-data";
import { galleryPhotos, type GalleryPhotoItem } from "@/template/content/gallery";
import { SkewCarousel } from "@/template/components/interactive/SkewCarousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/template/components/ui/Dialog";
import { Reveal } from "@/template/components/motion/Reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE KINETIC GALLERY (THE GLASSHOUSE LEDGER)
// Section metadata comes from platform. Photos are managed with true intrinsic dimensions in local manifest.

export function GallerySection({ data }: { data: GalleryData }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const selectedPhoto: GalleryPhotoItem | null =
    selectedPhotoIndex !== null && galleryPhotos[selectedPhotoIndex]
      ? galleryPhotos[selectedPhotoIndex]
      : null;

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % galleryPhotos.length : 0));
  }, [selectedPhotoIndex]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev - 1 + galleryPhotos.length) % galleryPhotos.length : 0
    );
  }, [selectedPhotoIndex]);

  return (
    <section
      id="gallery"
      className="template-section !pt-10 !pb-14 sm:!pt-12 sm:!pb-16 md:!pt-14 md:!pb-18 section-surface-paper text-center overflow-hidden"
    >
      <div className="template-container">
        <Reveal direction="up" distance={16}>
          <div className="mb-5 sm:mb-7 space-y-2">
            <span className="text-role-subheading">PHOTO FOLIO // 04</span>
            <h2 className="text-role-heading-major text-[var(--wedding-text)] tracking-tight">
              {data.sectionTitle || "Gallery"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-xl mx-auto mt-2 leading-relaxed">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        {galleryPhotos.length > 0 ? (
          <Reveal direction="up" distance={24} delay={0.1}>
            <div className="w-full">
              <SkewCarousel
                items={galleryPhotos}
                isLightboxOpen={Boolean(selectedPhoto)}
                onItemClick={(_item, idx) => setSelectedPhotoIndex(idx)}
                onActiveIndexChange={() => {}}
              />
            </div>
          </Reveal>
        ) : (
          <div className="bg-[var(--wedding-surface-alt)]/60 p-10 rounded-2xl border border-dashed border-[var(--wedding-border)] max-w-xl mx-auto text-center shadow-xs">
            <p className="text-xs font-mono text-[var(--wedding-text-muted)] uppercase tracking-wider">
              [ Official wedding photos will be mounted in the estate ledger here ]
            </p>
          </div>
        )}

        {/* Viewport-Fitting Desktop Lightbox with ZERO Internal Scrollbars */}
        {selectedPhoto && (
          <Dialog
            open={Boolean(selectedPhoto)}
            onOpenChange={(open) => {
              if (!open) setSelectedPhotoIndex(null);
            }}
          >
            <DialogContent className="w-full max-w-5xl h-[88dvh] sm:h-[90dvh] max-h-[calc(100dvh-2rem)] p-4 sm:p-5 flex flex-col overflow-hidden bg-[var(--wedding-surface)] border-2 border-[var(--wedding-border)] text-[var(--wedding-text)] shadow-2xl rounded-2xl">
              {/* Modal Header: shrink-0 */}
              <DialogHeader className="shrink-0 flex flex-row items-center justify-between pr-8 border-b border-[var(--wedding-border-subtle)] pb-2.5">
                <DialogTitle className="font-serif text-lg sm:text-xl text-[var(--wedding-text)] font-semibold flex items-center gap-3">
                  <span>{selectedPhoto.caption}</span>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--wedding-accent)]">
                    {selectedPhoto.folioLabel}
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Modal Media Stage: flex-1 min-h-0 dynamically fits remaining viewport */}
              <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2 my-2 bg-[var(--wedding-surface-alt)]/20 rounded-xl overflow-hidden">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-md select-none block"
                  sizes="(max-width: 1024px) 95vw, 1100px"
                  priority
                />

                {/* Lightbox Navigation Chevrons pinned to Media Box */}
                {galleryPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[var(--wedding-surface)]/90 hover:bg-[var(--wedding-surface)] text-[var(--wedding-text)] border border-[var(--wedding-border)] shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 template-focus-ring z-20"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[var(--wedding-surface)]/90 hover:bg-[var(--wedding-surface)] text-[var(--wedding-text)] border border-[var(--wedding-border)] shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 template-focus-ring z-20"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Modal Footer: shrink-0 */}
              <div className="shrink-0 text-center pt-1">
                <p className="text-xs text-[var(--wedding-text-muted)] italic font-serif">
                  {selectedPhoto.alt}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
