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
 * Features the high-contrast Estate Aurora palette (#24342C deep pine horizon, #74906A botanical sage waves,
 * #FFFDF7 luminous ivory crests) paired with a localized organic parchment reading island for flawless text contrast.
 */
export function SageAuroraBackground({
  className,
  speed = 0.3,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 18,
  tilt = 1.11,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 18,
  brightness = 1.05,
  opacity = 1.0,
  grain = true,
  grainIntensity = 0.02,
  horizonColor = "#24342C", // Deep Pine Shadow Horizon (Option B: Estate Aurora)
  waveColor = "#74906A", // Luminous Botanical Sage Wave Body
  crestColor = "#FFFDF7", // Luminous Warm Stationery White / Ivory Crest
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

      {/* 3. Localized Parchment Reading Zone (z-10) — Organic soft halo protecting text without washing out wave ridges */}
      {/* Mobile Reading Halo (< lg): Organic vertical halo behind top text stack */}
      <div
        className="block lg:hidden absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 27%, rgba(247, 244, 234, 0.97) 0%, rgba(247, 244, 234, 0.84) 28%, rgba(247, 244, 234, 0.48) 48%, rgba(247, 244, 234, 0.10) 68%, transparent 78%)",
        }}
      />

      {/* Desktop Localized Parchment Reading Island (>= lg): Soft organic halo centered behind left text column */}
      <div
        className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 31% 50%, rgba(247, 244, 234, 0.98) 0%, rgba(247, 244, 234, 0.92) 28%, rgba(247, 244, 234, 0.62) 46%, rgba(247, 244, 234, 0.18) 64%, rgba(247, 244, 234, 0.00) 76%)",
        }}
      />
    </div>
  );
}
