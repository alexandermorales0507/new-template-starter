"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { WeddingNavItem } from "@/template/navigation/wedding-navigation";
import { QuickDock } from "./QuickDock";
import { FloatingMusicBubble, useAudio } from "./AudioPlayer";

export type FloatingControlsProps = {
  items: WeddingNavItem[];
};

/**
 * Unified Floating Controls Cluster.
 * Coordinated bottom layout for QuickDock and FloatingMusicBubble.
 * Controls viewport bottom safe-area offsets and responsive compact mode as ONE system.
 */
export function FloatingControls({ items }: FloatingControlsProps) {
  const pathname = usePathname() || "/";
  const isHomePage = pathname === "/" || pathname === "";

  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(!isHomePage);
  const [isCompact, setIsCompact] = useState(false);

  const { playbackState } = useAudio();
  const isMusicActive = playbackState === "playing" || playbackState === "paused";

  // Handle scroll threshold on home page
  useEffect(() => {
    if (!isHomePage) {
      setHasScrolledPastHero(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 180) {
        setHasScrolledPastHero(true);
      } else if (scrollY < 48) {
        setHasScrolledPastHero(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Handle responsive compact sizing
  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Controls are visible if user scrolled past Hero OR if music is currently playing/active
  const isVisible = hasScrolledPastHero || isMusicActive;

  if (!isVisible || !items || items.length === 0) {
    return null;
  }

  return (
    <div
      className="wedding-floating-controls fixed inset-x-0 z-40 flex justify-center px-3 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-300"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
    >
      <div
        className={
          isMusicActive
            ? "inline-flex w-max max-w-[calc(100vw-1.5rem)] items-end justify-center gap-2 sm:gap-3 pointer-events-auto"
            : "flex w-full justify-center pointer-events-auto"
        }
      >
        <div className="flex min-w-0 flex-none justify-center">
          <QuickDock items={items} compact={isCompact} />
        </div>

        {isMusicActive && (
          <div className="flex flex-none justify-end">
            <FloatingMusicBubble layout="inline" compact={isCompact} />
          </div>
        )}
      </div>
    </div>
  );
}
