"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "./cn";

export interface ElectricDividerProps {
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return `rgba(0, 240, 255, ${alpha})`;
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h.slice(0, 6), 16);
  if (isNaN(int)) return `rgba(0, 240, 255, ${alpha})`;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ElectricDivider: React.FC<ElectricDividerProps> = ({
  color = "#00f0ff",
  speed = 1.5,
  chaos = 0.24,
  thickness = 2.5,
  className = "",
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const random = useCallback((x: number): number => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x: number, y: number): number => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random]
  );

  // 10-Octave Harmonic Turbulence Noise Synthesis
  const octavedNoise = useCallback(
    (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      baseAmplitude: number,
      baseFrequency: number,
      time: number,
      seed: number
    ): number => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i++) {
        y += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.35);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height || 40;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateSize();

    const draw = (currentTime: number) => {
      if (!canvas || !ctx) return;

      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += Math.min(deltaTime, 0.1) * (prefersReducedMotion ? 0.2 : speed);
      lastFrameTimeRef.current = currentTime;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const midY = height / 2;
      const sampleCount = Math.max(Math.floor(width / 2), 60);

      // 1. PRIMARY HIGH-VOLTAGE BOLT (Main 10-Octave Jagged Stroke)
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const x = progress * width;
        const edgeTaper = Math.sin(progress * Math.PI);
        const yNoise =
          octavedNoise(progress * 10, 10, 1.6, 0.7, chaos * 32, 10, timeRef.current, 0) * edgeTaper;
        const y = midY + yNoise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. SECONDARY OUT-OF-PHASE ERRATIC JITTER (Counter-Phase Plasma)
      ctx.beginPath();
      ctx.strokeStyle = hexToRgba(color, 0.75);
      ctx.lineWidth = Math.max(thickness * 0.6, 1.2);
      ctx.shadowBlur = 6;

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const x = progress * width;
        const edgeTaper = Math.sin(progress * Math.PI);
        const yNoise =
          octavedNoise(progress * 14, 8, 1.8, 0.65, chaos * 24, 12, timeRef.current * 1.7, 4) *
          edgeTaper;
        const y = midY + yNoise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. HOT WHITE CORE FILAMENT (High-Frequency Center Spark)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 4;

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const x = progress * width;
        const edgeTaper = Math.sin(progress * Math.PI);
        const yNoise =
          octavedNoise(progress * 10, 6, 1.6, 0.7, chaos * 18, 10, timeRef.current * 1.2, 0) *
          edgeTaper;
        const y = midY + yNoise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry ? entry.isIntersecting : true;
      },
      { rootMargin: "120px" }
    );
    intersectionObserver.observe(container);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [color, speed, chaos, thickness, octavedNoise, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "relative w-full h-10 overflow-visible pointer-events-none select-none z-30",
        className
      )}
      style={style}
    >
      {/* Ambient Neon Beam Underlay */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] w-full pointer-events-none"
        style={{
          background: color,
          filter: "blur(4px)",
          boxShadow: `0 0 16px ${hexToRgba(color, 0.85)}, 0 0 36px ${hexToRgba(color, 0.45)}`,
        }}
      />
      {/* Animated Dual-Arc Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
};

export default ElectricDivider;
