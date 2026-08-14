"use client";

import React, { useState, useEffect } from "react";
import type { WeddingNavItem } from "@/template/navigation/wedding-navigation";
import { Calendar, MapPin, Mail, Utensils, Shirt, Heart, Info, Clock } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Calendar,
  MapPin,
  Mail,
  Utensils,
  Shirt,
  Heart,
  Info,
  Clock,
};

export type QuickDockProps = {
  items: WeddingNavItem[];
};

export function QuickDock({ items }: QuickDockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!items || items.length === 0 || !isVisible) return null;

  return (
    <aside
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center pb-[env(safe-area-inset-bottom)] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
      role="toolbar"
      aria-label="Quick essential navigation"
    >
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-3 py-2 flex items-center gap-1.5 sm:gap-2">
        {items.map((item) => {
          const IconComponent = ICON_MAP[item.iconName] || Info;
          const isPrimary = item.isPrimaryAction;

          return (
            <div key={item.key} className="relative group">
              <a
                href={item.anchor}
                onMouseEnter={() => setActiveTooltip(item.key)}
                onMouseLeave={() => setActiveTooltip(null)}
                onFocus={() => setActiveTooltip(item.key)}
                onBlur={() => setActiveTooltip(null)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none template-focus-ring ${
                  isPrimary
                    ? "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:scale-105 active:scale-95"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-95 border border-gray-100"
                }`}
                aria-label={item.label}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              {/* Tooltip */}
              <div
                className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap shadow-md pointer-events-none transition-opacity duration-150 ${
                  activeTooltip === item.key ? "opacity-100" : "opacity-0"
                }`}
                role="tooltip"
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
