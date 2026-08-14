"use client";

import { useState } from "react";
import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { buildWeddingNavigation } from "@/template/navigation/wedding-navigation";
import { WeddingMonogram } from "./WeddingMonogram";
import { MoreDrawer } from "./MoreDrawer";
import { Menu, MoreHorizontal } from "lucide-react";

// DYNAMIC COUPLE IDENTITY & CANONICAL NAVIGATION.
// Redesign freely, but derive navigation from the canonical navigation model.
// Never hardcode client initials or flat 17-link lists.

export function Navbar({ data }: { data: WeddingTemplateData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navModel = buildWeddingNavigation(data);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Couple Identity / Monogram Home Anchor */}
          <a
            href="#host_info"
            className="flex items-center gap-2 template-focus-ring rounded-md"
            aria-label={`Home - ${data.coupleDisplayName}`}
          >
            <WeddingMonogram
              groomName={data.couple?.groomName}
              brideName={data.couple?.brideName}
              coupleDisplayName={data.coupleDisplayName}
              variant="nav"
            />
          </a>

          {/* Desktop Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-gray-600 shrink min-w-0">
            {navModel.primaryNavItems.map((item) => (
              <a
                key={item.key}
                href={item.anchor}
                className="hover:text-gray-900 transition-colors shrink-0 template-focus-ring rounded"
              >
                {item.label}
              </a>
            ))}

            {/* Overflow "More" Button for complete sitemap directory */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors template-focus-ring cursor-pointer"
              aria-label="Open full navigation menu"
            >
              <span>More</span>
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none template-focus-ring shrink-0 cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Overflow Sitemap Drawer */}
      <MoreDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={navModel.moreGroups}
        coupleDisplayName={data.coupleDisplayName}
      />
    </>
  );
}
