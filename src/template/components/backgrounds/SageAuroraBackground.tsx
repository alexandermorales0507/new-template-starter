"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
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
  detail?: "low" | "medium" | "high";
}

// Convert 6-digit hex color to normalized [r, g, b] float array
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

function createFragmentShader(steps: number): string {
  return `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float map(vec3 p) {
  float t = uTime * uSpeed;
  vec2 xz = p.xz * uWaveScale;
  
  // Primary harmonic rolling swell
  float wave = sin(xz.x * uWaveRatio + t) * cos(xz.y * uWaveRatio * 0.8 + t * 0.7) * uAmplitude;
  
  // Secondary harmonic for depth
  wave += sin(xz.x * 2.1 * uWaveRatio - t * 1.2) * cos(xz.y * 1.6 * uWaveRatio + t * 0.85) * (uAmplitude * 0.45) * (uSwell / 24.0);
  
  // Atmospheric gentle turbulence
  wave += sin((xz.x + xz.y) * 3.4 + t * 1.8) * (uAmplitude * 0.18) * (uTurbulence / 10.0);
  
  return p.y - wave;
}

vec3 calcNormal(vec3 p) {
  float d = 0.02;
  return normalize(vec3(
    map(p + vec3(d, 0.0, 0.0)) - map(p - vec3(d, 0.0, 0.0)),
    2.0 * d,
    map(p + vec3(0.0, 0.0, d)) - map(p - vec3(0.0, 0.0, d))
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  
  // Camera Ray Setup
  vec3 ro = vec3(0.0, uHeight, -uZoom * 4.5);
  vec3 rd = normalize(vec3(uv.x, uv.y - (uTilt - 1.0) * 0.5, 1.2));
  
  float t = 0.0;
  float tMax = 35.0;
  bool hit = false;
  vec3 p = ro;
  
  for (int i = 0; i < ${steps}; i++) {
    p = ro + rd * t;
    float d = map(p);
    if (d < 0.01) {
      hit = true;
      break;
    }
    t += max(d * 0.5, 0.04);
    if (t > tMax) break;
  }
  
  vec3 color = uHorizonColor;
  
  if (hit) {
    vec3 n = calcNormal(p);
    vec3 lightDir = normalize(vec3(0.3, 0.8, -0.5));
    
    float diff = max(dot(n, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
    float crestFactor = smoothstep(0.0, uAmplitude * 0.9, p.y);
    
    vec3 waveCol = mix(uWaveColor, uCrestColor, clamp(crestFactor * 0.7 + fresnel * 0.6, 0.0, 1.0));
    waveCol *= (0.75 + 0.45 * diff);
    
    float fog = clamp(1.0 - exp(-t / uFogDepth), 0.0, 1.0);
    color = mix(waveCol, uHorizonColor, fog);
  }
  
  color *= uBrightness;
  
  if (uGrain > 0.5) {
    float noise = (random(vUv + fract(uTime * 0.05)) - 0.5) * uGrainIntensity;
    color += noise;
  }
  
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
}

/**
 * Sage Estate Botanical Aurora Animated Background
 * Uses WebGL2 Gradient Waves shader (OGL) with responsive text-safe veils,
 * reduced-motion detection, intersection-based pause, and defensive static fallback.
 */
export function SageAuroraBackground({
  className,
  speed = 0.2,
  amplitude = 1.45,
  waveScale = 0.5,
  waveRatio = 0.9,
  swell = 24.0,
  turbulence = 10.0,
  tilt = 1.15,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 16.0,
  brightness = 1.05,
  opacity = 0.65,
  grain = true,
  grainIntensity = 0.02,
  horizonColor = "#DDE5D3", // Mist Sage Wash
  waveColor = "#657A57", // Conservatory Sage
  crestColor = "#EBDCC9", // Soft Champagne Gold / Pale Highlight
  detail,
}: SageAuroraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Reduced motion media query listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // WebGL Lifecycle Management
  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: Renderer | null = null;
    let animationFrameId: number | null = null;
    let isVisible = true;
    let isTabActive = !document.hidden;

    // Determine raymarch detail steps based on tier or viewport
    const chosenDetail = detail ?? (window.innerWidth < 768 ? "low" : "medium");
    const stepsCount = chosenDetail === "high" ? 110 : chosenDetail === "low" ? 40 : 70;

    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      setIsSupported(false);
      return;
    }

    const gl = renderer.gl;
    if (!gl) {
      setIsSupported(false);
      return;
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: createFragmentShader(stepsCount),
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaveScale: { value: waveScale },
        uWaveRatio: { value: waveRatio },
        uSwell: { value: swell },
        uTurbulence: { value: turbulence },
        uTilt: { value: tilt },
        uZoom: { value: zoom },
        uHeight: { value: height },
        uFogDepth: { value: fogDepth },
        uHorizonColor: { value: hexToRgb(horizonColor) },
        uWaveColor: { value: hexToRgb(waveColor) },
        uCrestColor: { value: hexToRgb(crestColor) },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uGrain: { value: grain ? 1.0 : 0.0 },
        uGrainIntensity: { value: grainIntensity },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Handle container resizing
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width * renderer.dpr, height * renderer.dpr];
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Render loop with visibility pause
    let startTime = performance.now();

    const animate = (now: number) => {
      if (isVisible && isTabActive) {
        const elapsed = (now - startTime) * 0.001;
        program.uniforms.uTime.value = elapsed;
        renderer?.render({ scene: mesh });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Pause when scrolled out of viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Pause when browser tab is inactive
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        startTime = performance.now() - (program.uniforms.uTime.value as number) * 1000;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      try {
        const loseContextExt = gl.getExtension("WEBGL_lose_context");
        loseContextExt?.loseContext();
      } catch {
        // Ignore errors during context loss
      }
    };
  }, [
    prefersReducedMotion,
    speed,
    amplitude,
    waveScale,
    waveRatio,
    swell,
    turbulence,
    tilt,
    zoom,
    height,
    fogDepth,
    brightness,
    opacity,
    grain,
    grainIntensity,
    horizonColor,
    waveColor,
    crestColor,
    detail,
  ]);

  return (
    <div
      ref={containerRef}
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
      {/* WebGL Animated Canvas */}
      {isSupported && !prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
      )}

      {/* Deterministic Text-Safe Veil Overlays */}
      {/* Mobile / Tablet Vertical Veil (< lg): Protects centered headlines while keeping lower/perimeter waves luminous */}
      <div
        className="block lg:hidden absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 244, 234, 0.86) 0%, rgba(247, 244, 234, 0.58) 45%, rgba(247, 244, 234, 0.20) 80%, rgba(247, 244, 234, 0.00) 100%)",
        }}
      />

      {/* Desktop Horizontal Veil (>= lg): Protects left editorial 7-col stack while leaving right 5-col portrait aurora vibrant */}
      <div
        className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(247, 244, 234, 0.88) 0%, rgba(247, 244, 234, 0.65) 45%, rgba(247, 244, 234, 0.18) 75%, rgba(247, 244, 234, 0.00) 100%)",
        }}
      />
    </div>
  );
}
