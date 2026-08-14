"use client";

import React, { useEffect } from "react";
import type { MoreDrawerGroup } from "@/template/navigation/wedding-navigation";
import {
  X,
  Calendar,
  MapPin,
  Mail,
  Utensils,
  Shirt,
  Heart,
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
  Heart,
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
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Celebration Details</h3>
            {coupleDisplayName && (
              <p className="text-xs text-gray-500 font-medium">{coupleDisplayName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors template-focus-ring"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 overscroll-contain">
          {groups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
                {group.title}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item) => {
                  const IconComponent = ICON_MAP[item.iconName] || Info;
                  return (
                    <a
                      key={item.key}
                      href={item.anchor}
                      onClick={onClose}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200 template-focus-ring"
                    >
                      <IconComponent className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="truncate font-medium">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-500">
          <p>Powered by WebSerbisyo RSVP</p>
        </div>
      </div>
    </div>
  );
}
