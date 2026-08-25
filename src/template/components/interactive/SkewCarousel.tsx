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
          className="relative inline-flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-[3px] border-slate-950 bg-white shadow-[6px_6px_0px_#0f172a] cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-100 border-2 border-slate-900 w-[min(84vw,330px)] sm:w-[440px] md:w-[500px] h-[280px] sm:h-[340px] md:h-[380px]">
            {item.src ? (
              <Image
                src={item.src}
                alt={item.alt || "Gallery preview"}
                fill
                sizes="(max-width: 640px) 84vw, 500px"
                className="object-cover rounded-xl select-none pointer-events-none transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-6 text-center text-xs font-mono text-slate-500 bg-slate-100 rounded-xl">
                [ ACTION CARD #01 ]
              </div>
            )}
          </div>
          {item.caption ? (
            <div className="w-full mt-2.5 px-1 flex items-center justify-between gap-4 text-left">
              <p className="text-xs font-bold text-slate-950 font-sans truncate">{item.caption}</p>
              <span className="text-[10px] font-black font-mono tracking-wider uppercase text-[var(--event-primary)] shrink-0">
                {item.folioLabel || item.title || "HERO #01"}
              </span>
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
                    "relative inline-flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border-[3px] border-slate-950 transition-all duration-300 select-none",
                    isCurrentlyActive
                      ? "shadow-[10px_10px_0px_#0f172a] ring-2 ring-amber-400 scale-[1.02] cursor-pointer"
                      : "shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] opacity-90 cursor-pointer"
                  )}
                  onClick={() => {
                    if (isCurrentlyActive) {
                      onItemClick?.(item, idx);
                    } else {
                      swiperRef.current?.slideTo(idx);
                    }
                  }}
                  title={
                    isCurrentlyActive
                      ? "Click to open expanded view"
                      : "Click to focus trading card"
                  }
                >
                  {/* Corner Collector Card Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="comic-badge comic-badge-gold text-[10px] py-0.5 px-2 font-mono shadow-[2px_2px_0px_#0f172a]">
                      CARD #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Photo Stage */}
                  <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-100 border-2 border-slate-900 w-[240px] sm:w-[280px] md:w-[320px] h-[300px] sm:h-[350px] md:h-[390px]">
                    {item.src ? (
                      <Image
                        src={item.src}
                        alt={item.alt || `Card ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                        className="object-cover select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-6 text-center text-xs font-mono text-slate-500 bg-slate-100">
                        [ ACTION CARD #{String(idx + 1).padStart(2, "0")} ]
                      </div>
                    )}
                  </div>

                  {/* Trading Card Caption Strip */}
                  <div className="w-full mt-2.5 px-1 flex items-center justify-between gap-3 text-left shrink-0 h-6">
                    {item.caption ? (
                      <p className="text-xs font-bold text-slate-950 font-sans truncate max-w-[68%]">
                        {item.caption}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] font-black font-mono tracking-wider uppercase text-[var(--event-primary)] shrink-0">
                      {item.folioLabel || `HERO #${String(idx + 1).padStart(2, "0")}`}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Comic Navigation Shelf & Progress Rail */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 select-none min-h-[44px]">
        {/* Previous Chevron Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 rounded-xl bg-white text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all template-focus-ring cursor-pointer"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Numeric Counter: CURRENT / TOTAL */}
        <div className="font-mono text-xs font-black tracking-wider text-slate-300 px-1">
          <span className="text-amber-400 font-black">{currentFormatted}</span>
          <span className="mx-1 text-slate-500">/</span>
          <span className="text-slate-400">{totalFormatted}</span>
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
                  "h-2 rounded-full transition-all duration-300 cursor-pointer border border-slate-950",
                  isSegActive
                    ? "w-7 sm:w-9 bg-[var(--event-primary)] shadow-[2px_2px_0px_#0f172a]"
                    : "w-2.5 sm:w-3.5 bg-slate-700 hover:bg-slate-500 opacity-80"
                )}
              />
            );
          })}
        </div>

        {/* Next Chevron Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 rounded-xl bg-white text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all template-focus-ring cursor-pointer"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
