"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import {
  buildWeddingNavigation,
  resolveWeddingHref,
} from "@/template/navigation/wedding-navigation";
import { WeddingMonogram } from "./WeddingMonogram";
import { MoreDrawer } from "./MoreDrawer";
import { Menu } from "lucide-react";

// DYNAMIC COUPLE IDENTITY & CANONICAL NAVIGATION.
// Generalized 3-zone balanced navbar with adaptive scroll states.

export function Navbar({ data }: { data: WeddingTemplateData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const isHomePage = pathname === "/" || pathname === "";

  const navModel = buildWeddingNavigation(data);
  const isScrolled = !isHomePage || hasScrolled;

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
        className="wedding-nav fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Left Monogram (min-w-[120px] for symmetrical balance) */}
          <div className="flex items-center min-w-[100px] sm:min-w-[120px]">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="template-focus-ring rounded-md inline-flex items-center"
              aria-label={`Home - ${data.coupleDisplayName} wedding`}
            >
              <WeddingMonogram
                groomName={data.couple?.groomName}
                brideName={data.couple?.brideName}
                coupleDisplayName={data.coupleDisplayName}
                variant="nav"
              />
            </Link>
          </div>

          {/* Zone 2: Center Primary Browsing Links */}
          <nav
            aria-label="Primary browsing navigation"
            className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700 select-none"
          >
            {navModel.primaryNavItems.map((item) => {
              const resolvedHref = resolveWeddingHref(item.anchor, pathname);

              return (
                <Link
                  key={item.key}
                  href={resolvedHref}
                  onClick={(e) => handleAnchorClick(e, item.anchor)}
                  className="wedding-nav-link py-2 relative text-gray-600 hover:text-gray-900 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-gray-900 template-focus-ring rounded-xs"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Right More / Menu Trigger (min-w-[120px] for symmetrical balance) */}
          <div className="flex items-center justify-end min-w-[100px] sm:min-w-[120px]">
            <button
              onClick={() => setDrawerOpen(true)}
              className="wedding-nav-menu inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 template-focus-ring cursor-pointer"
              aria-expanded={drawerOpen}
              aria-controls="sitemap-drawer"
              aria-label="Open complete celebration menu"
            >
              <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5">
                More
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
