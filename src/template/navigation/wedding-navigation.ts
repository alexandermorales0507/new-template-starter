// CANONICAL WEDDING NAVIGATION MODEL — SINGLE SOURCE OF TRUTH.
// Derives primary navigation, floating quick dock, and overflow sitemap drawer
// from connected WeddingTemplateData (enabled sections + section order).
// Protects against dead links and desynchronized nav surfaces.

import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import {
  WEDDING_APPLICABLE_SECTION_KEYS,
  type WeddingApplicableSectionKey,
} from "@/platform/contract";

export type NavigationGroup =
  "Celebration" | "Event Essentials" | "Wedding Party" | "Guest Info & Actions";

export type WeddingNavItem = {
  key: WeddingApplicableSectionKey;
  label: string;
  anchor: string;
  group: NavigationGroup;
  iconName: string;
  isPrimaryTopNav: boolean;
  isDockEligible: boolean;
  isMoreEligible: boolean;
  isPrimaryAction?: boolean;
};

export const WEDDING_SECTION_NAV_DEFINITIONS: Record<
  WeddingApplicableSectionKey,
  Omit<WeddingNavItem, "key">
> = {
  host_info: {
    label: "Home",
    anchor: "/",
    group: "Celebration",
    iconName: "Home",
    isPrimaryTopNav: false, // Monogram serves as Home in TopNav
    isDockEligible: false,
    isMoreEligible: true,
  },
  countdown: {
    label: "Countdown",
    anchor: "#countdown",
    group: "Celebration",
    iconName: "Clock",
    isPrimaryTopNav: true,
    isDockEligible: false,
    isMoreEligible: true,
  },
  music_effects: {
    label: "Music",
    anchor: "#music_effects",
    group: "Celebration",
    iconName: "Music",
    isPrimaryTopNav: false, // Keep out of compact TopNav per platform contract
    isDockEligible: false,
    isMoreEligible: true, // Discoverable in More Drawer when enabled!
  },
  gallery: {
    label: "Gallery",
    anchor: "#gallery",
    group: "Celebration",
    iconName: "Image",
    isPrimaryTopNav: true,
    isDockEligible: false,
    isMoreEligible: true,
  },
  main_event: {
    label: "Ceremony",
    anchor: "#main_event",
    group: "Event Essentials",
    iconName: "Calendar",
    isPrimaryTopNav: false, // Essential logistics live in Dock
    isDockEligible: true,
    isMoreEligible: true,
  },
  venue: {
    label: "Venue",
    anchor: "#venue",
    group: "Event Essentials",
    iconName: "MapPin",
    isPrimaryTopNav: false, // Essential logistics live in Dock
    isDockEligible: true,
    isMoreEligible: true,
  },
  secondary_event: {
    label: "Reception",
    anchor: "#secondary_event",
    group: "Event Essentials",
    iconName: "Utensils",
    isPrimaryTopNav: false, // Essential logistics live in Dock
    isDockEligible: true,
    isMoreEligible: true,
  },
  timeline_program: {
    label: "Timeline",
    anchor: "#timeline_program",
    group: "Event Essentials",
    iconName: "Clock3",
    isPrimaryTopNav: true,
    isDockEligible: false,
    isMoreEligible: true,
  },
  entourage: {
    label: "Entourage",
    anchor: "#entourage",
    group: "Wedding Party",
    iconName: "Users",
    isPrimaryTopNav: false,
    isDockEligible: false,
    isMoreEligible: true,
  },
  principal_sponsors: {
    label: "Sponsors",
    anchor: "#principal_sponsors",
    group: "Wedding Party",
    iconName: "Award",
    isPrimaryTopNav: false,
    isDockEligible: false,
    isMoreEligible: true,
  },
  attire_motif: {
    label: "Attire",
    anchor: "#attire_motif",
    group: "Event Essentials",
    iconName: "Shirt",
    isPrimaryTopNav: false, // Essential logistics live in Dock
    isDockEligible: true,
    isMoreEligible: true,
  },
  extra_info: {
    label: "Details",
    anchor: "#extra_info",
    group: "Guest Info & Actions",
    iconName: "Info",
    isPrimaryTopNav: true,
    isDockEligible: false,
    isMoreEligible: true,
  },
  rsvp_form: {
    label: "RSVP",
    anchor: "/rsvp",
    group: "Guest Info & Actions",
    iconName: "Mail",
    isPrimaryTopNav: false, // Primary CTA lives in Dock
    isDockEligible: true,
    isMoreEligible: true,
    isPrimaryAction: true,
  },
  gift_details: {
    label: "Gifts",
    anchor: "#gift_details",
    group: "Guest Info & Actions",
    iconName: "Gift",
    isPrimaryTopNav: false,
    isDockEligible: false,
    isMoreEligible: true,
  },
  guestbook: {
    label: "Guestbook",
    anchor: "#guestbook",
    group: "Guest Info & Actions",
    iconName: "MessageSquare",
    isPrimaryTopNav: true,
    isDockEligible: false,
    isMoreEligible: true,
  },
  story_message: {
    label: "Our Story",
    anchor: "#story_message",
    group: "Celebration",
    iconName: "BookOpen",
    isPrimaryTopNav: true,
    isDockEligible: false,
    isMoreEligible: true,
  },
  contact_socials: {
    label: "Contact",
    anchor: "#contact_socials",
    group: "Guest Info & Actions",
    iconName: "Phone",
    isPrimaryTopNav: false,
    isDockEligible: false,
    isMoreEligible: true,
  },
};

// Curated browsing links priority for TopNav center
const TOP_NAV_ORDER_PREFERENCE: WeddingApplicableSectionKey[] = [
  "countdown",
  "gallery",
  "timeline_program",
  "extra_info",
  "guestbook",
  "story_message",
];

const DOCK_PREFERENCE_ORDER: WeddingApplicableSectionKey[] = [
  "main_event",
  "venue",
  "rsvp_form",
  "secondary_event",
  "attire_motif",
];

const NAVIGATION_GROUP_ORDER: NavigationGroup[] = [
  "Celebration",
  "Event Essentials",
  "Wedding Party",
  "Guest Info & Actions",
];

export type MoreDrawerGroup = {
  title: NavigationGroup;
  items: WeddingNavItem[];
};

export type CanonicalWeddingNavigation = {
  enabledKeys: WeddingApplicableSectionKey[];
  primaryNavItems: WeddingNavItem[];
  dockItems: WeddingNavItem[];
  moreGroups: MoreDrawerGroup[];
  allEnabledItems: WeddingNavItem[];
};

/**
 * Resolves a destination anchor or route based on the current pathname.
 * - If destination is Home ("#host_info" or "/"), returns "/"
 * - If on root ("/" or "") and anchor starts with "#", returns "#anchor"
 * - If on a subroute (e.g. "/rsvp") and anchor starts with "#", returns "/#anchor"
 * - If anchor is a subroute path (e.g. "/rsvp"), returns "/rsvp"
 */
export function resolveWeddingHref(anchor: string, currentPathname: string = "/"): string {
  const isRoot = currentPathname === "/" || currentPathname === "";

  if (anchor === "#host_info" || anchor === "/") {
    return "/";
  }

  if (anchor.startsWith("#")) {
    return isRoot ? anchor : `/${anchor}`;
  }

  return anchor;
}

/**
 * Checks whether contact_socials contains any meaningful non-empty fields.
 */
export function hasMeaningfulContactContent(contact?: WeddingTemplateData["contact"]): boolean {
  if (!contact) return false;
  return Boolean(
    contact.contactPerson?.trim() ||
    contact.contactNumber?.trim() ||
    contact.email?.trim() ||
    contact.facebookUrl?.trim() ||
    contact.instagramUrl?.trim() ||
    contact.tikTokUrl?.trim()
  );
}

/**
 * Builds the unified navigation model for a wedding template.
 */
export function buildWeddingNavigation(data: WeddingTemplateData): CanonicalWeddingNavigation {
  const enabledSet = new Set((data.enabledSectionKeys || []) as WeddingApplicableSectionKey[]);

  // If contact_socials is enabled but has zero actual content, exclude it from navigation to avoid dead links
  if (enabledSet.has("contact_socials") && !hasMeaningfulContactContent(data.contact)) {
    enabledSet.delete("contact_socials");
  }

  // Filter all enabled items according to template data
  const allEnabledItems: WeddingNavItem[] = WEDDING_APPLICABLE_SECTION_KEYS.filter((key) =>
    enabledSet.has(key)
  ).map((key) => ({
    key,
    ...WEDDING_SECTION_NAV_DEFINITIONS[key],
  }));

  // Primary TopNav: Curated browsing sections (up to 5-6 items when enabled)
  const primaryNavItems: WeddingNavItem[] = TOP_NAV_ORDER_PREFERENCE.filter((key) =>
    enabledSet.has(key)
  ).map((key) => ({
    key,
    ...WEDDING_SECTION_NAV_DEFINITIONS[key],
  }));

  // Quick Dock items: Filtered essential shortcuts (up to 5 items)
  const dockItems: WeddingNavItem[] = DOCK_PREFERENCE_ORDER.filter((key) =>
    enabledSet.has(key)
  ).map((key) => ({
    key,
    ...WEDDING_SECTION_NAV_DEFINITIONS[key],
  }));

  // More Drawer items: Grouped by category containing ALL enabled items
  const moreGroups: MoreDrawerGroup[] = NAVIGATION_GROUP_ORDER.map((group) => ({
    title: group,
    items: allEnabledItems.filter((item) => item.group === group && item.isMoreEligible),
  })).filter((group) => group.items.length > 0);

  return {
    enabledKeys: Array.from(enabledSet),
    primaryNavItems,
    dockItems,
    moreGroups,
    allEnabledItems,
  };
}
