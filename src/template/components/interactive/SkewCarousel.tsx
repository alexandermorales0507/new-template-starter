"use client";

import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Keyboard, A11y } from "swiper/modules";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../ui/cn";
import type { GalleryOrientation } from "@/template/content/gallery";

export interface SkewCarouselItem {
  id: string | number;
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  folioLabel?: string;
  width?: number;
  height?: number;
  orientation?: GalleryOrientation;
}

export interface SkewCarouselProps {
  items: SkewCarouselItem[];
  isLightboxOpen?: boolean;
  onActiveIndexChange?: (index: number) => void;
  onItemClick?: (item: SkewCarouselItem, index: number) => void;
  className?: string;
}

export function SkewCarousel({
  items,
  isLightboxOpen = false,
  onActiveIndexChange,
  onItemClick,
  className,
}: SkewCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Control autoplay state based on lightbox open/closed
  useEffect(() => {
    if (!swiperRef.current || !swiperRef.current.autoplay) return;
    if (isLightboxOpen || shouldReduceMotion) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
  }, [isLightboxOpen, shouldReduceMotion]);

  if (!items || items.length === 0) {
    return null;
  }

  // Single-item graceful static degradation
  if (items.length === 1) {
    const item = items[0];

    return (
      <div className={cn("mx-auto p-4 font-sans flex justify-center", className)}>
        <div
          onClick={() => onItemClick?.(item, 0)}
          className="relative inline-flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-2 border-[var(--wedding-border)] bg-[var(--wedding-surface)] shadow-card cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[var(--wedding-surface-alt)]/20">
            {item.src ? (
              <Image
                src={item.src}
                alt={item.alt || "Gallery preview"}
                width={item.width || 2752}
                height={item.height || 1536}
                className="block w-auto h-auto max-w-[min(84vw,330px)] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px] max-h-[300px] sm:max-h-[360px] md:max-h-[410px] lg:max-h-[440px] object-contain rounded-lg select-none pointer-events-none"
                sizes="(max-width: 640px) 84vw, 560px"
              />
            ) : (
              <div className="flex h-48 w-64 items-center justify-center text-xs font-mono text-[var(--wedding-text-muted)]">
                [ PHOTO MEMORY ]
              </div>
            )}
          </div>
          {item.caption ? (
            <div className="w-full mt-2.5 px-1 flex items-center justify-between gap-4 text-left">
              <p className="text-xs font-medium text-[var(--wedding-text)] font-sans truncate">
                {item.caption}
              </p>
              {item.folioLabel || item.title ? (
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-[var(--wedding-accent)] shrink-0">
                  {item.folioLabel || item.title}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // Scalable numeric formatting helper
  const digits = Math.max(2, String(items.length).length);
  const currentFormatted = String(activeIndex + 1).padStart(digits, "0");
  const totalFormatted = String(items.length).padStart(digits, "0");

  // Capped 5-segment progress mapping algorithm
  const totalItems = items.length;
  const segmentCount = Math.min(5, totalItems);
  const activeSegment =
    totalItems > 1
      ? Math.min(
          segmentCount - 1,
          Math.max(0, Math.round((activeIndex / (totalItems - 1)) * (segmentCount - 1)))
        )
      : 0;

  const handleSegmentClick = (segIdx: number) => {
    if (totalItems <= 1 || !swiperRef.current) return;
    const targetIndex = Math.min(
      totalItems - 1,
      Math.max(0, Math.round((segIdx / (segmentCount - 1)) * (totalItems - 1)))
    );
    swiperRef.current.slideTo(targetIndex);
  };

  return (
    <div className={cn("w-full py-1 select-none font-sans flex flex-col items-center", className)}>
      {/* 3D Scene Viewport with Shared 1000px Perspective */}
      <div
        className="w-full max-w-6xl mx-auto flex justify-center items-center overflow-visible"
        style={{ perspective: "1000px" }}
      >
        <Swiper
          modules={[Autoplay, Keyboard, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={Math.min(1, items.length - 1)}
          keyboard={{ enabled: true }}
          watchSlidesProgress={true}
          rewind={true}
          autoplay={
            shouldReduceMotion
              ? false
              : {
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                }
          }
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            onActiveIndexChange?.(swiper.activeIndex);
          }}
          className="!overflow-visible w-full h-[420px] sm:h-[480px] md:h-[530px] py-1"
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          {items.map((item, idx) => {
            const diff = idx - activeIndex;
            const isCurrentlyActive = diff === 0;
            const absDiff = Math.abs(diff);

            // React-Bits-like 5-Position 3D Shelf Transform Values
            let rotateYDeg = 0;
            let scaleVal = 1;
            let translateZPx = 0;
            let zIndexVal = 30;
            let isVisibleInScene = true;

            if (!shouldReduceMotion) {
              if (diff === 0) {
                // Active Center
                rotateYDeg = 0;
                scaleVal = 1;
                translateZPx = 0;
                zIndexVal = 30;
              } else if (diff === -1) {
                // Near Left: Inward-turning positive rotateY
                rotateYDeg = 32;
                scaleVal = 0.9;
                translateZPx = -150;
                zIndexVal = 20;
              } else if (diff === 1) {
                // Near Right: Inward-turning negative rotateY
                rotateYDeg = -32;
                scaleVal = 0.9;
                translateZPx = -150;
                zIndexVal = 20;
              } else if (diff === -2) {
                // Outer Left: Stronger inward perspective
                rotateYDeg = 52;
                scaleVal = 0.82;
                translateZPx = -270;
                zIndexVal = 10;
              } else if (diff === 2) {
                // Outer Right: Stronger inward perspective
                rotateYDeg = -52;
                scaleVal = 0.82;
                translateZPx = -270;
                zIndexVal = 10;
              } else {
                // Outside 5-position window
                rotateYDeg = diff < 0 ? 60 : -60;
                scaleVal = 0.72;
                translateZPx = -360;
                zIndexVal = 5;
                isVisibleInScene = false;
              }
            }

            return (
              <SwiperSlide
                key={item.id}
                className={cn(
                  "!w-auto h-full flex items-center justify-center px-1.5 sm:px-3 md:px-4 transition-all duration-300",
                  !isVisibleInScene && "pointer-events-none opacity-0 md:opacity-100"
                )}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: zIndexVal,
                }}
              >
                {/* 3D Transform Layer with Inward Angle & Zero Opacity Fading */}
                <div
                  style={{
                    transform: `perspective(1000px) rotateY(${rotateYDeg}deg) scale(${scaleVal}) translateZ(${translateZPx}px)`,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transition:
                      "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
                  }}
                  className={cn(
                    "relative inline-flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-[var(--wedding-surface)] border-2 transition-all duration-300 select-none shadow-card",
                    isCurrentlyActive
                      ? "border-[var(--wedding-primary)] ring-2 ring-[var(--wedding-accent)]/70 shadow-xl cursor-pointer"
                      : "border-[var(--wedding-border)] hover:border-[var(--wedding-primary)]/50 cursor-pointer"
                  )}
                  onClick={() => {
                    if (isCurrentlyActive) {
                      onItemClick?.(item, idx);
                    } else {
                      swiperRef.current?.slideTo(idx);
                    }
                  }}
                  title={
                    isCurrentlyActive ? "Click to open expanded view" : "Click to focus photograph"
                  }
                >
                  {/* Photo Frame Auto-Fitting the Rendered Photography */}
                  <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[var(--wedding-surface-alt)]/20">
                    {item.src ? (
                      <Image
                        src={item.src}
                        alt={item.alt || `Photo ${idx + 1}`}
                        width={item.width || 2752}
                        height={item.height || 1536}
                        sizes="(max-width: 640px) 84vw, (max-width: 1024px) 60vw, 560px"
                        className="block w-auto h-auto max-w-[min(84vw,330px)] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px] max-h-[300px] sm:max-h-[360px] md:max-h-[410px] lg:max-h-[440px] object-contain rounded-lg select-none pointer-events-none"
                      />
                    ) : (
                      <div className="flex h-44 w-60 items-center justify-center p-6 text-center text-xs font-mono text-[var(--wedding-text-muted)]">
                        [ PHOTO #{String(idx + 1).padStart(2, "0")} ]
                      </div>
                    )}
                  </div>

                  {/* Archival Glasshouse Caption Strip */}
                  <div className="w-full mt-2 sm:mt-2.5 px-1 flex items-center justify-between gap-3 text-left shrink-0 h-6">
                    {item.caption ? (
                      <p className="text-xs font-medium text-[var(--wedding-text)] font-sans truncate max-w-[68%]">
                        {item.caption}
                      </p>
                    ) : (
                      <span />
                    )}
                    {item.folioLabel || item.title ? (
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-[var(--wedding-accent)] shrink-0">
                        {item.folioLabel || item.title}
                      </span>
                    ) : null}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Glasshouse Ledger Progress Rail & Navigation Shelf */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 select-none min-h-[44px]">
        {/* Previous Chevron Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-9 h-9 rounded-full bg-[var(--wedding-surface)] text-[var(--wedding-text)] border border-[var(--wedding-border)] shadow-xs flex items-center justify-center hover:bg-[var(--wedding-surface-alt)] hover:scale-105 active:scale-95 transition-all template-focus-ring cursor-pointer"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numeric Counter: CURRENT / TOTAL */}
        <div className="font-mono text-xs font-bold tracking-wider text-[var(--wedding-text-muted)] px-1">
          <span className="text-[var(--wedding-accent)]">{currentFormatted}</span>
          <span className="mx-1 opacity-40">/</span>
          <span>{totalFormatted}</span>
        </div>

        {/* Capped 5-Segment Progress Rail */}
        <div
          className="flex items-center gap-1.5 px-2 py-1"
          role="tablist"
          aria-label="Gallery slide segments"
        >
          {Array.from({ length: segmentCount }).map((_, i) => {
            const isSegActive = i === activeSegment;

            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isSegActive}
                aria-label={`Jump to gallery section ${i + 1}`}
                onClick={() => handleSegmentClick(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer template-focus-ring",
                  isSegActive
                    ? "w-7 sm:w-9 bg-[var(--wedding-primary)] shadow-xs"
                    : "w-2.5 sm:w-3.5 bg-[var(--wedding-border)] hover:bg-[var(--wedding-primary)]/50 opacity-80"
                )}
              />
            );
          })}
        </div>

        {/* Next Chevron Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="w-9 h-9 rounded-full bg-[var(--wedding-surface)] text-[var(--wedding-text)] border border-[var(--wedding-border)] shadow-xs flex items-center justify-center hover:bg-[var(--wedding-surface-alt)] hover:scale-105 active:scale-95 transition-all template-focus-ring cursor-pointer"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
