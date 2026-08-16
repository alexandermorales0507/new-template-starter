"use client";

import { useEffect, useState } from "react";
import GradientWaves, { type GradientWavesDetail } from "@/components/GradientWaves";
import { cn } from "@/template/components/ui/cn";

export interface SageAuroraBackgroundProps {
  className?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  brightness?: number;
  opacity?: number;
  grain?: boolean;
  grainIntensity?: number;
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  detail?: GradientWavesDetail;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
}

/**
 * Sage Estate Botanical Aurora Background
 * Pure Sage configuration wrapper around the official React Bits GradientWaves component.
 * Exposes high-contrast wave geometry with Deep Forest Sage bodies, Luminous Ivory crests,
 * quiet static fallback base, and localized text-safe protection.
 */
export function SageAuroraBackground({
  className,
  speed = 0.32,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 18,
  tilt = 1.11,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 15,
  brightness = 1.0,
  opacity = 1.0,
  grain = true,
  grainIntensity = 0.02,
  horizonColor = "#DDE5D3", // Mist Sage Wash
  waveColor = "#304438", // Deep Forest Sage Body (High Separation)
  crestColor = "#FFFDF7", // Luminous Warm Stationery White / Ivory Highlight
  detail = "medium",
  mouseInteraction = false,
  parallaxStrength = 0,
}: SageAuroraBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden",
        className
      )}
    >
      {/* 1. Quiet Static Fallback Base (z-0) — SSR First Paint & Reduced-Motion Safe Base */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: "linear-gradient(135deg, #f7f4ea 0%, #dde5d3 100%)",
        }}
      />

      {/* 2. Official React Bits GradientWaves WebGL2 Engine (z-[1]) */}
      {!prefersReducedMotion && (
        <GradientWaves
          horizonColor={horizonColor}
          waveColor={waveColor}
          crestColor={crestColor}
          speed={speed}
          amplitude={amplitude}
          waveScale={waveScale}
          waveRatio={waveRatio}
          swell={swell}
          turbulence={turbulence}
          tilt={tilt}
          zoom={zoom}
          height={height}
          fogDepth={fogDepth}
          brightness={brightness}
          opacity={opacity}
          detail={detail}
          grain={grain}
          grainIntensity={grainIntensity}
          mouseInteraction={mouseInteraction}
          parallaxStrength={parallaxStrength}
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        />
      )}

      {/* 3. Localized Text-Safe Overlays (z-10) — Protects text without washing out center & portrait waves */}
      {/* Mobile Top Text Veil (< lg): Protects centered top typography while leaving lower portrait area vibrant */}
      <div
        className="block lg:hidden absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 244, 234, 0.72) 0%, rgba(247, 244, 234, 0.50) 32%, rgba(247, 244, 234, 0.18) 58%, rgba(247, 244, 234, 0.00) 78%)",
        }}
      />

      {/* Desktop Localized Left Text Veil (>= lg): Covers left 60% only, leaving center & right portrait field 100% unobstructed */}
      <div
        className="hidden lg:block absolute left-0 top-0 bottom-0 w-[60%] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(247, 244, 234, 0.68) 0%, rgba(247, 244, 234, 0.48) 38%, rgba(247, 244, 234, 0.20) 70%, rgba(247, 244, 234, 0.00) 100%)",
        }}
      />
    </div>
  );
}
