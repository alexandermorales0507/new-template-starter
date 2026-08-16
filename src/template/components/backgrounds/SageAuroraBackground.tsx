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
 * FINAL ART-DIRECTION IMPLEMENTATION: "ESTATE FOREST AURORA"
 * Translates the React Bits demo contrast structure into the Sage Estate DNA:
 * - Deep Forest Horizon / Troughs (#304438)
 * - Luminous Botanical Sage Wave Body (#8FA878)
 * - Warm Cloud Ivory Crests (#FFFDF7)
 * - Deep Estate Forest Fallback (#24342C -> #304438 -> #3F5949)
 * - 100% Unobstructed Wave Visibility across the entire Hero
 */
export function SageAuroraBackground({
  className,
  speed = 0.34,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 15,
  brightness = 1.0,
  opacity = 1.0,
  grain = true,
  grainIntensity = 0.05,
  horizonColor = "#304438", // Deep Forest Horizon & Troughs
  waveColor = "#8FA878", // Luminous Botanical Sage Wave Body (High Contrast)
  crestColor = "#FFFDF7", // Warm Cloud Ivory Crest Highlight
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
      {/* 1. Deep Estate Forest Static Fallback Base (z-0) — SSR First Paint & Reduced-Motion Safe Base */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: "linear-gradient(135deg, #24342C 0%, #304438 48%, #3F5949 100%)",
        }}
      />

      {/* 2. Official React Bits GradientWaves WebGL2 Engine (z-[1]) — 100% Unobstructed */}
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
    </div>
  );
}
