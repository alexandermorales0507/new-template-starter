"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MoreDrawerGroup } from "@/template/navigation/event-navigation";
import { resolveEventHref } from "@/template/navigation/event-navigation";
import {
  X,
  Calendar,
  MapPin,
  Mail,
  Utensils,
  Shirt,
  Sparkles,
  Zap,
  Info,
  Clock,
  Clock3,
  Users,
  Award,
  Image,
  MessageSquare,
  BookOpen,
  Music,
  Phone,
  Gift,
  Home,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Calendar,
  MapPin,
  Mail,
  Utensils,
  Shirt,
  Heart: Sparkles,
  Sparkles,
  Zap,
  Info,
  Clock,
  Clock3,
  Users,
  Award,
  Image,
  MessageSquare,
  BookOpen,
  Music,
  Phone,
  Gift,
  Home,
};

export type MoreDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  groups: MoreDrawerGroup[];
  coupleDisplayName?: string;
};

export function MoreDrawer({ isOpen, onClose, groups, coupleDisplayName }: MoreDrawerProps) {
  const pathname = usePathname() || "/";
  const isHomePage = pathname === "/" || pathname === "";

  // Handle ESC key press and scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    onClose();

    if (anchor === "/rsvp" && pathname === "/rsvp") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isHomePage && anchor.startsWith("#")) {
      e.preventDefault();
      setTimeout(() => {
        const target = document.querySelector(anchor);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

  return (
    <div
      id="sitemap-drawer"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Complete celebration menu"
    >
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l-2 border-slate-950">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-950 bg-amber-400">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-950 uppercase">
            MISSION DIRECTORY
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-950 hover:bg-black/10 transition-colors template-focus-ring cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 overscroll-contain select-none">
          {groups.map((group, gIdx) => (
            <div key={group.title} className="space-y-2.5">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>{group.title}</span>
                <span className="text-[10px] font-bold text-[var(--event-primary)]">
                  CHAPTER 0{gIdx + 1}
                </span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item) => {
                  const IconComponent = ICON_MAP[item.iconName] || Info;
                  const resolvedHref = resolveEventHref(item.anchor, pathname);

                  return (
                    <Link
                      key={item.key}
                      href={resolvedHref}
                      onClick={(e) => handleLinkClick(e, item.anchor)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition-colors border border-slate-200 hover:border-slate-950 template-focus-ring"
                    >
                      <IconComponent className="w-4 h-4 text-[var(--event-primary)] shrink-0" />
                      <span className="truncate font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t-2 border-slate-950 bg-slate-50 text-center text-xs text-slate-500">
          <p>
            Custom RSVP by{" "}
            <a
              href="https://rsvp.webserbisyo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-950 hover:underline font-bold"
            >
              WebSerbisyo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
