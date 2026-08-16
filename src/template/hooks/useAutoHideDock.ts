"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export const DOCK_IDLE_DELAY = 3000;
export const SCROLL_SETTLE_DELAY = 120;
export const DESKTOP_BOTTOM_ZONE = 80;

export type UseAutoHideDockOptions = {
  idleDelay?: number;
  scrollSettleDelay?: number;
  bottomZoneHeight?: number;
  isLockedVisible?: boolean;
};

export function useAutoHideDock({
  idleDelay = DOCK_IDLE_DELAY,
  scrollSettleDelay = SCROLL_SETTLE_DELAY,
  bottomZoneHeight = DESKTOP_BOTTOM_ZONE,
  isLockedVisible = false,
}: UseAutoHideDockOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);

  const isVisibleRef = useRef(true);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const isLockedRef = useRef(isLockedVisible);
  isLockedRef.current = isLockedVisible;

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollSettleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setDockVisible = useCallback((visible: boolean) => {
    if (isVisibleRef.current !== visible) {
      isVisibleRef.current = visible;
      setIsVisible(visible);
    }
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearScrollSettleTimer = useCallback(() => {
    if (scrollSettleTimerRef.current) {
      clearTimeout(scrollSettleTimerRef.current);
      scrollSettleTimerRef.current = null;
    }
  }, []);

  const scheduleIdleHide = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      if (
        !isHoveredRef.current &&
        !isFocusedRef.current &&
        !isPointerDownRef.current &&
        !isLockedRef.current
      ) {
        setDockVisible(false);
      }
    }, idleDelay);
  }, [clearIdleTimer, idleDelay, setDockVisible]);

  const showDock = useCallback(() => {
    setDockVisible(true);
  }, [setDockVisible]);

  // Initial load: visible on mount, schedule 3000ms idle hide
  useEffect(() => {
    setDockVisible(true);
    scheduleIdleHide();

    return () => {
      clearIdleTimer();
      clearScrollSettleTimer();
    };
  }, [scheduleIdleHide, clearIdleTimer, clearScrollSettleTimer, setDockVisible]);

  // Lock changes (e.g. drawer opened)
  useEffect(() => {
    if (isLockedVisible) {
      clearIdleTimer();
      setDockVisible(true);
    } else {
      scheduleIdleHide();
    }
  }, [isLockedVisible, clearIdleTimer, scheduleIdleHide, setDockVisible]);

  // Window scroll detection (Passive, immediate reveal, debounced settle -> idle countdown)
  useEffect(() => {
    const handleScroll = () => {
      setDockVisible(true);
      clearIdleTimer();

      clearScrollSettleTimer();
      scrollSettleTimerRef.current = setTimeout(() => {
        scheduleIdleHide();
      }, scrollSettleDelay);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [clearIdleTimer, clearScrollSettleTimer, scheduleIdleHide, scrollSettleDelay, setDockVisible]);

  // Desktop bottom-edge proximity recovery (pointer: fine only)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const isInBottomZone = e.clientY >= windowHeight - bottomZoneHeight;
      const isInHorizontalCenterZone =
        e.clientX >= windowWidth * 0.2 && e.clientX <= windowWidth * 0.8;

      if (isInBottomZone && isInHorizontalCenterZone) {
        setDockVisible(true);
        clearIdleTimer();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [bottomZoneHeight, clearIdleTimer, setDockVisible]);

  // Dock container event handlers
  const onPointerEnter = useCallback(() => {
    isHoveredRef.current = true;
    clearIdleTimer();
    setDockVisible(true);
  }, [clearIdleTimer, setDockVisible]);

  const onPointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    scheduleIdleHide();
  }, [scheduleIdleHide]);

  const onPointerDown = useCallback(() => {
    isPointerDownRef.current = true;
    clearIdleTimer();
    setDockVisible(true);
  }, [clearIdleTimer, setDockVisible]);

  const onPointerUp = useCallback(() => {
    isPointerDownRef.current = false;
    if (!isHoveredRef.current && !isFocusedRef.current) {
      scheduleIdleHide();
    }
  }, [scheduleIdleHide]);

  const onFocusCapture = useCallback(() => {
    isFocusedRef.current = true;
    clearIdleTimer();
    setDockVisible(true);
  }, [clearIdleTimer, setDockVisible]);

  const onBlurCapture = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      const currentTarget = e.currentTarget;
      const nextTarget = e.relatedTarget as Node | null;
      if (!currentTarget || !nextTarget || !currentTarget.contains(nextTarget)) {
        isFocusedRef.current = false;
        scheduleIdleHide();
      }
    },
    [scheduleIdleHide]
  );

  return {
    isVisible: isVisible || isLockedVisible,
    dockHandlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onFocusCapture,
      onBlurCapture,
    },
    showDock,
    scheduleIdleHide,
  };
}
