"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { WeddingNavItem } from "@/template/navigation/wedding-navigation";
import { resolveWeddingHref } from "@/template/navigation/wedding-navigation";
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
  compact?: boolean;
  className?: string;
};

export function QuickDock({ items, compact = false, className = "" }: QuickDockProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const pathname = usePathname() || "/";
  const isHomePage = pathname === "/" || pathname === "";

  if (!items || items.length === 0) return null;

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    if (isHomePage && anchor.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(anchor);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <aside
      className={`wedding-guest-dock bg-[var(--wedding-dock-bg)] backdrop-blur-md border border-[var(--border-default)] shadow-xl rounded-full flex items-center shrink-0 ${
        compact ? "gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2" : "gap-2.5 sm:gap-3 px-3.5 py-2"
      } ${className}`}
      role="toolbar"
      aria-label="Guest essentials navigation"
    >
      {items.map((item) => {
        const IconComponent = ICON_MAP[item.iconName] || Info;
        const isPrimary = item.isPrimaryAction;
        const resolvedHref = resolveWeddingHref(item.anchor, pathname);

        return (
          <div key={item.key} className="relative group">
            <Link
              href={resolvedHref}
              onClick={(e) => handleItemClick(e, item.anchor)}
              onMouseEnter={() => setActiveTooltip(item.key)}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip(item.key)}
              onBlur={() => setActiveTooltip(null)}
              className={`rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none template-focus-ring shrink-0 ${
                compact ? "w-[38px] h-[38px]" : "w-11 h-11"
              } ${
                isPrimary
                  ? "bg-[var(--action-primary)] text-[var(--action-text)] shadow-md hover:bg-[var(--action-primary-hover)] hover:scale-105 active:scale-95"
                  : "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-default)] hover:text-[var(--text-primary)] active:scale-95 border border-[var(--border-subtle)]"
              }`}
              aria-label={item.label}
            >
              <IconComponent className={compact ? "w-[18px] h-[18px]" : "w-5 h-5"} />
            </Link>

            {/* Floating Tooltip */}
            <div
              className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[var(--surface-dark)] text-[var(--text-on-dark)] text-[11px] font-mono uppercase tracking-wider rounded-md whitespace-nowrap shadow-md pointer-events-none transition-opacity duration-150 ${
                activeTooltip === item.key ? "opacity-100" : "opacity-0"
              }`}
              role="tooltip"
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
