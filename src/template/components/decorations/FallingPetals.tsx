"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  resolvePetalTheme,
  type PetalColorTuple,
  type PetalTheme,
} from "@/template/theme/resolve-petal-theme";

export const PETAL_COLOR_WEIGHTS = [
  { role: "light", weight: 38 }, // 38% Warm Ivory
  { role: "secondary", weight: 28 }, // 28% Mist Sage
  { role: "primary", weight: 20 }, // 20% Botanical Sage
  { role: "metallic", weight: 10 }, // 10% Antique Gold
  { role: "botanical", weight: 4 }, // 4% Deep Forest
] as const;

type Petal = {
  x: number;
  y: number;
  centerX: number;
  size: number;
  speedY: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
  colorTuple: PetalColorTuple;
  opacity: number;
  depth: number;
};

type ViewportConfig = {
  targetCount: number;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
};

// Dynamic Viewport Config Helper to prevent closure trapping
function getViewportConfig(width: number, pathname: string): ViewportConfig {
  const isRsvp = pathname === "/rsvp";
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  if (isMobile) {
    return {
      targetCount: isRsvp ? 8 : 14,
      minSize: isRsvp ? 4 : 5,
      maxSize: isRsvp ? 12 : 14,
      minOpacity: isRsvp ? 0.26 : 0.3,
      maxOpacity: isRsvp ? 0.5 : 0.58,
    };
  }

  if (isTablet) {
    return {
      targetCount: isRsvp ? 12 : 22,
      minSize: isRsvp ? 6 : 7,
      maxSize: isRsvp ? 15 : 18,
      minOpacity: isRsvp ? 0.28 : 0.34,
      maxOpacity: isRsvp ? 0.55 : 0.65,
    };
  }

  // Desktop (>= 1024px)
  return {
    targetCount: isRsvp ? 16 : 28,
    minSize: isRsvp ? 7 : 9,
    maxSize: isRsvp ? 20 : 24,
    minOpacity: isRsvp ? 0.32 : 0.38,
    maxOpacity: isRsvp ? 0.62 : 0.72,
  };
}

export function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const pathname = usePathname() || "/";

  useEffect(() => {
    // Accessibility Check: Stop if reduced motion is enabled
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resolve theme custom properties once upon animation initialization
    const petalTheme = resolvePetalTheme(canvas);

    // Initialize config dynamically based on current viewport width
    const currentWidth = window.visualViewport?.width ?? window.innerWidth;
    let config = getViewportConfig(currentWidth, pathname);

    // Weighted color distribution selector (38% ivory, 28% mist, 20% sage, 10% gold, 4% forest)
    const getRandomColorTuple = (theme: PetalTheme): PetalColorTuple => {
      const rand = Math.random() * 100;
      if (rand < 38) return theme.light; // 38% Warm Ivory
      if (rand < 66) return theme.secondary; // 28% Mist Sage
      if (rand < 86) return theme.primary; // 20% Botanical Sage
      if (rand < 96) return theme.metallic; // 10% Antique Gold
      return theme.botanical; // 4% Deep Forest
    };

    // Helper to create a single petal particle using the current config
    const createPetal = (yPos: number, activeConfig = config): Petal => {
      const sizeCategory = Math.random();
      let size = 0;

      const minSize = activeConfig.minSize;
      const maxSize = activeConfig.maxSize;
      const sizeRange = maxSize - minSize;

      if (sizeCategory < 0.25) {
        // Small background petals (25%)
        size = minSize + Math.random() * (sizeRange * 0.4);
      } else if (sizeCategory < 0.94) {
        // Normal body petals (69%)
        size = minSize + sizeRange * 0.3 + Math.random() * (sizeRange * 0.5);
      } else {
        // Large accent petals (6%)
        size = minSize + sizeRange * 0.7 + Math.random() * (sizeRange * 0.3);
      }

      const isLargeAccent = sizeCategory >= 0.94;
      const depth = 0.45 + Math.random() * 0.55; // Parallax depth factor

      // Large accent petals fall slower and sway wider
      const speedYMultiplier = isLargeAccent ? 0.6 : 1.0;
      const swayMultiplier = isLargeAccent ? 1.45 : 1.0;

      const initialWidth = dimensionsRef.current.width || window.innerWidth;
      const centerX = Math.random() * (initialWidth + 200) - 100;

      return {
        x: centerX,
        y: yPos,
        centerX,
        size,
        speedY: (0.18 + Math.random() * 0.38) * depth * speedYMultiplier,
        sway: (30 + Math.random() * 50) * depth * swayMultiplier,
        swaySpeed: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        colorTuple: getRandomColorTuple(petalTheme),
        opacity:
          activeConfig.minOpacity +
          Math.random() * (activeConfig.maxOpacity - activeConfig.minOpacity),
        depth,
      };
    };

    // Resize Handler
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.visualViewport?.width ?? window.innerWidth;
      const height = window.innerHeight;

      dimensionsRef.current = { width, height };

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // 1. Recalculate config dynamically on resize
      const newConfig = getViewportConfig(width, pathname);
      config = newConfig;

      // 2. Reconcile particle count dynamically
      let petals = petalsRef.current;
      const targetCount = newConfig.targetCount;

      if (petals.length === 0) {
        // Initial population spread randomly across screen height
        const newPetals: Petal[] = [];
        for (let i = 0; i < targetCount; i++) {
          newPetals.push(createPetal(Math.random() * height, newConfig));
        }
        petalsRef.current = newPetals;
      } else if (petals.length < targetCount) {
        // Add more petals if window expanded
        while (petals.length < targetCount) {
          petals.push(createPetal(-40, newConfig));
        }
      } else if (petals.length > targetCount) {
        // Trim petals if window shrank
        petalsRef.current = petals.slice(0, targetCount);
      }

      // 3. Gently clamp or scale existing particles to fit new size/opacity bounds
      petals = petalsRef.current;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        if (p.size > newConfig.maxSize) {
          p.size = newConfig.minSize + Math.random() * (newConfig.maxSize - newConfig.minSize);
        }
        if (p.opacity > newConfig.maxOpacity) {
          p.opacity =
            newConfig.minOpacity + Math.random() * (newConfig.maxOpacity - newConfig.minOpacity);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resizeCanvas);
    }

    // Drawing function for a single botanical teardrop petal shape
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Simulate 3D tumbling by scaling height based on rotation phase
      const scaleX = p.depth;
      const scaleY = p.depth * Math.abs(Math.sin(p.phase * 0.5));
      ctx.scale(scaleX, scaleY);

      // Create subtle linear gradient shading for 3D depth
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, p.colorTuple.highlight);
      grad.addColorStop(0.55, p.colorTuple.base);
      grad.addColorStop(1, p.colorTuple.shadow);

      ctx.fillStyle = grad;

      // Apply soft theme canvas shadow for larger foreground petals
      if (p.size > 14) {
        ctx.shadowColor = petalTheme.canvasShadow;
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
      }

      // Draw a soft organic botanical teardrop petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.4, p.size * 0.4, p.size * 0.8, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.4, p.size * 0.8, -p.size * 0.7, -p.size * 0.4, 0, -p.size);
      ctx.closePath();

      ctx.globalAlpha = p.opacity;
      ctx.fill();

      // Draw subtle center vein for delicate botanical detail
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = p.colorTuple.vein;
      ctx.lineWidth = Math.max(0.65, p.size * 0.045);
      ctx.globalAlpha = p.opacity * 0.45;

      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.75);
      ctx.quadraticCurveTo(p.size * 0.04, -p.size * 0.25, 0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    // Animation Frame Loop
    const update = () => {
      ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);

      const petals = petalsRef.current;
      const height = dimensionsRef.current.height;
      const width = dimensionsRef.current.width;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Update physics
        p.y += p.speedY;
        p.phase += p.swaySpeed;

        // Gentle wind drift to the right
        p.centerX += 0.12;
        p.x = p.centerX + Math.sin(p.phase) * p.sway;
        p.rotation += p.rotationSpeed;

        // Reset if petal falls below screen or drifts too far right
        if (p.y > height + p.size + 20 || p.x > width + p.size + 100) {
          petals[i] = createPetal(-40, config);
        } else {
          drawPetal(p);
        }
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    // Page Visibility Pause (Save battery when tab is hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      } else {
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(update);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", resizeCanvas);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[3] select-none"
      aria-hidden="true"
    />
  );
}
