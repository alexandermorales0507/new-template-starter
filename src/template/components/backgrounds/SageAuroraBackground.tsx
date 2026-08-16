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
 * Features high-contrast botanical tones, visible rolling wave geometry, tuned text-safe veils,
 * and reduced-motion fallback.
 */
export function SageAuroraBackground({
  className,
  speed = 0.3,
  amplitude = 2.4,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 32,
  turbulence = 16,
  tilt = 1.11,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 15,
  brightness = 1.0,
  opacity = 1.0,
  grain = true,
  grainIntensity = 0.02,
  horizonColor = "#DDE5D3", // Mist Sage Wash
  waveColor = "#465E42", // Deep Botanical Conservatory Sage
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
      style={{
        // Static Botanical Dawn CSS Fallback (SSR First Paint + WebGL/Reduced-Motion Safe Base)
        background: `radial-gradient(circle at 75% 65%, rgba(101, 122, 87, 0.30) 0%, rgba(221, 229, 211, 0.45) 40%, rgba(247, 244, 234, 1) 85%), linear-gradient(135deg, #f7f4ea 0%, #dde5d3 100%)`,
      }}
    >
      {/* Official React Bits GradientWaves WebGL2 Engine */}
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

      {/* Deterministic Text-Safe Veil Overlays (Light & localized to preserve wave geometry visibility) */}
      {/* Mobile / Tablet Vertical Veil (< lg): Protects centered headlines while keeping waves luminous */}
      <div
        className="block lg:hidden absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 244, 234, 0.55) 0%, rgba(247, 244, 234, 0.28) 40%, rgba(247, 244, 234, 0.00) 80%)",
        }}
      />

      {/* Desktop Horizontal Veil (>= lg): Protects left editorial 7-col stack while leaving center & portrait waves vibrant */}
      <div
        className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(247, 244, 234, 0.58) 0%, rgba(247, 244, 234, 0.32) 35%, rgba(247, 244, 234, 0.04) 65%, rgba(247, 244, 234, 0.00) 100%)",
        }}
      />
    </div>
  );
}
