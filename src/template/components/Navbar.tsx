"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EventTemplateData } from "@/platform/event-template-data";
import { buildEventNavigation, resolveEventHref } from "@/template/navigation/event-navigation";
import { extractMilestoneNumber } from "@/template/utils/host-identity";
import { MoreDrawer } from "./MoreDrawer";
import { Menu } from "lucide-react";

// DYNAMIC HOST IDENTITY & CANONICAL NAVIGATION.
// Generalized 3-zone balanced navbar with adaptive scroll states for Sage Estate.

export function Navbar({ data }: { data: EventTemplateData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const isHomePage = pathname === "/" || pathname === "";

  const navModel = buildEventNavigation(data);
  const isScrolled = !isHomePage || hasScrolled;

  const fullName =
    data.couple?.celebrantName || data.couple?.groomName || data.coupleDisplayName || "Michael";
  const firstName = fullName.trim().split(/\s+/)[0] || "Michael";
  const milestoneNum =
    extractMilestoneNumber(
      data.couple?.milestoneAge ? String(data.couple?.milestoneAge) : undefined
    ) || "10";
  const milestoneText = data.couple?.milestoneAge
    ? String(data.couple?.milestoneAge)
    : `${milestoneNum}th Birthday`;

  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) return;
      setHasScrolled(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    if (isHomePage && anchor.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(anchor);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        data-scrolled={isScrolled ? "true" : "false"}
        className="event-nav fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 bg-slate-950/90 backdrop-blur-md border-b-2 border-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
          {/* Zone 1: Left Celebrant Wordmark */}
          <div className="flex items-center min-w-[100px] sm:min-w-[120px]">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="template-focus-ring rounded-md inline-flex items-center"
              aria-label={`Home - ${data.coupleDisplayName} celebration`}
            >
              <div className="flex items-center gap-2 select-none">
                {/* Primary Wordmark */}
                <span className="font-heading font-black tracking-wider text-white text-sm sm:text-base lg:text-lg uppercase">
                  {firstName}
                </span>
                <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">•</span>
                {/* Milestone & Emoji */}
                <span className="font-heading font-bold tracking-wide text-amber-400 text-xs sm:text-sm lg:text-base uppercase">
                  <span className="hidden sm:inline">
                    {milestoneText || `${milestoneNum}th Birthday`}
                  </span>
                  <span className="sm:hidden">{milestoneNum}th</span>
                </span>
                <span className="text-sm sm:text-base">🎂</span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Center Primary Browsing Links */}
          <nav
            aria-label="Primary browsing navigation"
            className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8 text-sm font-bold uppercase tracking-wider text-slate-300 select-none"
          >
            {navModel.primaryNavItems.map((item) => {
              const resolvedHref = resolveEventHref(item.anchor, pathname);

              return (
                <Link
                  key={item.key}
                  href={resolvedHref}
                  onClick={(e) => handleAnchorClick(e, item.anchor)}
                  className="event-nav-link py-2 relative hover:text-white transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-[var(--event-primary)] template-focus-ring rounded-xs"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Right More / Menu Trigger */}
          <div className="flex items-center justify-end min-w-[100px] sm:min-w-[120px]">
            <button
              onClick={() => setDrawerOpen(true)}
              className="event-nav-menu inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 template-focus-ring cursor-pointer border border-slate-700/60"
              aria-expanded={drawerOpen}
              aria-controls="sitemap-drawer"
              aria-label="Open complete celebration menu"
            >
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider font-mono">
                Menu
              </span>
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
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
