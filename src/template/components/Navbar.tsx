"use client";

import { useState } from "react";
import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { eventWebsiteSectionContract } from "@/platform/contract";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";
import { Menu, X } from "lucide-react";

// DYNAMIC COUPLE IDENTITY.
// Redesign freely, but derive initials/names from WeddingTemplateData.
// Never hardcode client initials.

export function Navbar({ data }: { data: WeddingTemplateData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const identity = deriveCoupleIdentity(
    data.couple?.groomName,
    data.couple?.brideName,
    data.coupleDisplayName
  );

  const navItems = data.enabledSectionKeys
    .map((key) => eventWebsiteSectionContract.find((e) => e.key === key))
    .filter((e): e is (typeof eventWebsiteSectionContract)[number] =>
      Boolean(e && e.navigationEligible)
    );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a
          href="#host_info"
          className="flex items-center gap-2 font-bold text-base md:text-lg text-gray-900 tracking-tight shrink-0 whitespace-nowrap template-focus-ring rounded-md"
        >
          <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {identity.compactMonogram}
          </span>
          <span>{identity.displayName}</span>
        </a>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-gray-600 overflow-x-auto no-scrollbar py-2 whitespace-nowrap shrink min-w-0">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="hover:text-gray-900 transition-colors shrink-0 template-focus-ring rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none template-focus-ring shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2 text-sm text-gray-700 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-gray-900 border-b border-gray-100 last:border-0 template-focus-ring"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
