"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { GalleryData } from "@/platform/event-template-data";
import { galleryPhotos, type GalleryPhotoItem } from "@/template/content/gallery";
import { SkewCarousel } from "@/template/components/interactive/SkewCarousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/template/components/ui/Dialog";
import { Reveal } from "@/template/components/motion/Reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Section metadata comes from platform. Photos are managed with true intrinsic dimensions in local manifest.

export function GallerySection({ data }: { data: GalleryData }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const displayPhotos: GalleryPhotoItem[] =
    Array.isArray((data as unknown as { images?: GalleryPhotoItem[] }).images) &&
    (data as unknown as { images?: GalleryPhotoItem[] }).images!.length > 0
      ? (data as unknown as { images?: GalleryPhotoItem[] }).images!
      : galleryPhotos;

  const selectedPhoto: GalleryPhotoItem | null =
    selectedPhotoIndex !== null && displayPhotos[selectedPhotoIndex]
      ? displayPhotos[selectedPhotoIndex]
      : null;

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % displayPhotos.length : 0));
  }, [selectedPhotoIndex, displayPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev - 1 + displayPhotos.length) % displayPhotos.length : 0
    );
  }, [selectedPhotoIndex, displayPhotos.length]);

  return (
    <section
      id="gallery"
      className="template-section !pt-20 !pb-14 sm:!pt-24 sm:!pb-16 md:!pt-28 md:!pb-18 text-center relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="mb-5 sm:mb-7 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              PHOTO FOLIO // 04
            </span>
            <h2 className="text-role-heading-major text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "Gallery"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-xl mx-auto mt-2 leading-relaxed text-[var(--event-on-dark-muted,#94a3b8)]">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        {displayPhotos.length > 0 ? (
          <Reveal direction="up" distance={24} delay={0.1}>
            <div className="w-full">
              <SkewCarousel
                items={displayPhotos}
                isLightboxOpen={Boolean(selectedPhoto)}
                onItemClick={(_item, idx) => setSelectedPhotoIndex(idx)}
                onActiveIndexChange={() => {}}
              />
            </div>
          </Reveal>
        ) : (
          <div className="bg-[var(--event-surface-alt)]/60 p-10 rounded-2xl border-2 border-dashed border-[var(--event-border)] max-w-xl mx-auto text-center shadow-[var(--event-shadow-paper-sm)]">
            <p className="text-xs font-mono text-[var(--event-text-muted)] uppercase tracking-wider">
              [ Official celebration photos will be mounted here ]
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
            <DialogContent className="w-full max-w-5xl h-[88dvh] sm:h-[90dvh] max-h-[calc(100dvh-2rem)] p-4 sm:p-5 flex flex-col overflow-hidden bg-[var(--event-surface)] border-2 border-[var(--event-border)] text-[var(--event-text-main)] shadow-2xl rounded-2xl">
              {/* Modal Header: shrink-0 */}
              <DialogHeader className="shrink-0 flex flex-row items-center justify-between pr-8 border-b border-[var(--event-border-subtle)] pb-2.5">
                <DialogTitle className="font-serif text-lg sm:text-xl text-[var(--event-text-main)] font-semibold flex items-center gap-3">
                  <span>{selectedPhoto.caption}</span>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--event-primary)]">
                    {selectedPhoto.folioLabel}
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Modal Media Stage: flex-1 min-h-0 dynamically fits remaining viewport */}
              <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2 my-2 bg-[var(--event-surface-alt)]/20 rounded-xl overflow-hidden">
                {selectedPhoto.src ? (
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt || "Expanded photo"}
                    width={selectedPhoto.width || 1600}
                    height={selectedPhoto.height || 1200}
                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-md select-none block"
                    sizes="(max-width: 1024px) 95vw, 1100px"
                    priority
                  />
                ) : (
                  <div className="flex h-64 w-80 items-center justify-center text-xs font-mono text-[var(--event-text-muted)] bg-[var(--event-surface-alt)]/40 rounded-xl">
                    [ PHOTO MEMORY ]
                  </div>
                )}

                {/* Lightbox Navigation Chevrons pinned to Media Box */}
                {displayPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[var(--event-surface)]/90 hover:bg-[var(--event-surface)] text-[var(--event-text-main)] border-2 border-[var(--event-border)] shadow-[var(--event-shadow-paper-sm)] flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 template-focus-ring z-20"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[var(--event-surface)]/90 hover:bg-[var(--event-surface)] text-[var(--event-text-main)] border-2 border-[var(--event-border)] shadow-[var(--event-shadow-paper-sm)] flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 template-focus-ring z-20"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Modal Footer: shrink-0 */}
              <div className="shrink-0 text-center pt-1">
                <p className="text-xs text-[var(--event-text-muted)] italic font-serif">
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
