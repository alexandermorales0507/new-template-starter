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
  speed = 1.2,
  chaos = 0.22,
  thickness = 2.2,
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

  // High-Frequency Pixel-Relative Electrical Noise Engine
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
      const height = rect.height || 56;

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
      timeRef.current += Math.min(deltaTime, 0.1) * (prefersReducedMotion ? 0.2 : speed * 4.5);
      lastFrameTimeRef.current = currentTime;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const midY = height / 2;
      const sampleCount = Math.max(Math.floor(width / 3), 80);

      // PASS 1: OUTER AMBIENT NEON ARC (Soft Glowing Halo Arc)
      ctx.beginPath();
      ctx.strokeStyle = hexToRgba(color, 0.85);
      ctx.lineWidth = 3.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const x = progress * width;
        const edgeTaper = Math.sin(progress * Math.PI);
        const yNoise =
          octavedNoise(x, 6, 2.0, 0.65, chaos * 24, 0.035, timeRef.current * 3.5, 0) * edgeTaper;
        const y = midY + yNoise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // PASS 2: PRIMARY HIGH-CHAOS JAGGED BOLT (Main Electric Discharge)
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const x = progress * width;
        const edgeTaper = Math.sin(progress * Math.PI);
        const yNoise =
          octavedNoise(x, 8, 2.2, 0.7, chaos * 30, 0.07, timeRef.current * 7.0, 100) * edgeTaper;
        const y = midY + yNoise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // PASS 3: HOT-WHITE OUT-OF-PHASE PLASMA FILAMENT (High-Voltage Core Spark)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 1.0;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 4;

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const x = progress * width;
        const edgeTaper = Math.sin(progress * Math.PI);
        const yNoise =
          octavedNoise(x, 6, 2.0, 0.6, chaos * 18, 0.1, timeRef.current * 9.0, 200) * edgeTaper;
        const y = midY + yNoise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadow blur
      ctx.shadowBlur = 0;

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
        "relative w-full h-14 overflow-visible pointer-events-none select-none z-30",
        className
      )}
      style={style}
    >
      {/* Animated 3-Pass Electrical Discharge Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
};

export default ElectricDivider;
