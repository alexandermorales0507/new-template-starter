"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { EventNavItem } from "@/template/navigation/event-navigation";
import { QuickDock } from "./QuickDock";
import { FloatingMusicBubble, useAudio } from "./AudioPlayer";
import { useAutoHideDock } from "../hooks/useAutoHideDock";

export type FloatingControlsProps = {
  items: EventNavItem[];
};

/**
 * Unified Floating Controls Cluster.
 * Coordinated bottom layout for QuickDock and FloatingMusicBubble.
 * Auto-hides the navigation QuickDock after 3 seconds of idle, while keeping
 * active FloatingMusicBubble visible and fully accessible.
 */
export function FloatingControls({ items }: FloatingControlsProps) {
  const [isCompact, setIsCompact] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { isVisible: isDockVisible, dockHandlers } = useAutoHideDock();

  const { playbackState } = useAudio();
  const isMusicActive = playbackState === "playing" || playbackState === "paused";

  // Handle responsive compact sizing
  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  const dockVariants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      pointerEvents: "auto" as const,
    },
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
      scale: shouldReduceMotion ? 1 : 0.98,
      pointerEvents: "none" as const,
    },
  };

  const dockTransition = {
    duration: isDockVisible ? 0.28 : 0.35,
    ease: isDockVisible ? ([0.16, 1, 0.3, 1] as const) : ([0.4, 0, 0.2, 1] as const),
  };

  return (
    <div
      className="event-floating-controls fixed inset-x-0 z-40 flex justify-center px-3 pointer-events-none"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
    >
      <div
        className={
          isMusicActive
            ? "inline-flex w-max max-w-[calc(100vw-1.5rem)] items-end justify-center gap-2 sm:gap-3"
            : "flex w-full justify-center"
        }
      >
        <div className="flex min-w-0 flex-none justify-center">
          <motion.div
            variants={dockVariants}
            initial="visible"
            animate={isDockVisible ? "visible" : "hidden"}
            transition={dockTransition}
            {...dockHandlers}
            className="flex justify-center"
          >
            <QuickDock items={items} compact={isCompact} />
          </motion.div>
        </div>

        {isMusicActive && (
          <div className="flex flex-none justify-end pointer-events-auto">
            <FloatingMusicBubble layout="inline" compact={isCompact} />
          </div>
        )}
      </div>
    </div>
  );
}
