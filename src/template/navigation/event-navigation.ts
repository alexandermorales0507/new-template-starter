// CANONICAL EVENT NAVIGATION MODEL — SINGLE SOURCE OF TRUTH.
// Derives primary navigation, floating quick dock, and overflow sitemap drawer
// from connected EventTemplateData (enabled sections + section order).
// Protects against dead links and desynchronized nav surfaces.

import type { EventTemplateData } from "@/platform/event-template-data";
import { EVENT_APPLICABLE_SECTION_KEYS, type EventApplicableSectionKey } from "@/platform/contract";

export type NavigationGroup =
  "Celebration" | "Event Essentials" | "Event Party" | "Guest Info & Actions";

export type EventNavItem = {
  key: EventApplicableSectionKey;
  label: string;
  anchor: string;
  group: NavigationGroup;
  iconName: string;
  isPrimaryTopNav: boolean;
  isDockEligible: boolean;
  isMoreEligible: boolean;
  isPrimaryAction?: boolean;
};

export type WeddingNavItem = EventNavItem;

export const EVENT_SECTION_NAV_DEFINITIONS: Record<
  EventApplicableSectionKey,
  Omit<EventNavItem, "key">
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
    group: "Event Party",
    iconName: "Users",
    isPrimaryTopNav: false,
    isDockEligible: false,
    isMoreEligible: true,
  },
  principal_sponsors: {
    label: "Sponsors",
    anchor: "#principal_sponsors",
    group: "Event Party",
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

export const WEDDING_SECTION_NAV_DEFINITIONS = EVENT_SECTION_NAV_DEFINITIONS;

// Curated browsing links priority for TopNav center
const TOP_NAV_ORDER_PREFERENCE: EventApplicableSectionKey[] = [
  "countdown",
  "gallery",
  "timeline_program",
  "extra_info",
  "guestbook",
  "story_message",
];

const DOCK_PREFERENCE_ORDER: EventApplicableSectionKey[] = [
  "main_event",
  "venue",
  "rsvp_form",
  "secondary_event",
  "attire_motif",
];

const NAVIGATION_GROUP_ORDER: NavigationGroup[] = [
  "Celebration",
  "Event Essentials",
  "Event Party",
  "Guest Info & Actions",
];

export type MoreDrawerGroup = {
  title: NavigationGroup;
  items: EventNavItem[];
};

export type CanonicalEventNavigation = {
  enabledKeys: EventApplicableSectionKey[];
  primaryNavItems: EventNavItem[];
  dockItems: EventNavItem[];
  moreGroups: MoreDrawerGroup[];
  allEnabledItems: EventNavItem[];
};

export type CanonicalWeddingNavigation = CanonicalEventNavigation;

/**
 * Resolves a destination anchor or route based on the current pathname.
 * - If destination is Home ("#host_info" or "/"), returns "/"
 * - If on root ("/" or "") and anchor starts with "#", returns "#anchor"
 * - If on a subroute (e.g. "/rsvp") and anchor starts with "#", returns "/#anchor"
 * - If anchor is a subroute path (e.g. "/rsvp"), returns "/rsvp"
 */
export function resolveEventHref(anchor: string, currentPathname: string = "/"): string {
  const isRoot = currentPathname === "/" || currentPathname === "";

  if (anchor === "#host_info" || anchor === "/") {
    return "/";
  }

  if (anchor.startsWith("#")) {
    return isRoot ? anchor : `/${anchor}`;
  }

  return anchor;
}

export const resolveWeddingHref = resolveEventHref;

/**
 * Checks whether contact_socials contains any meaningful non-empty fields.
 */
export function hasMeaningfulContactContent(contact?: EventTemplateData["contact"]): boolean {
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
 * Builds the unified navigation model for an event template.
 */
export function buildEventNavigation(data: EventTemplateData): CanonicalEventNavigation {
  const enabledSet = new Set((data.enabledSectionKeys || []) as EventApplicableSectionKey[]);

  // Detect birthday event type
  const isBirthday =
    data.eventType === "birthday" || data.couple?.kind === "birthday" || !data.couple?.brideName;

  const getAdaptedLabel = (key: EventApplicableSectionKey, defaultLabel: string): string => {
    if (isBirthday) {
      if (key === "main_event") return "PARTY";
      if (key === "secondary_event") return "DINNER";
      if (key === "story_message") return "STORY";
      if (key === "principal_sponsors") return "VIP GUESTS";
      if (key === "entourage") return "COURT & HOSTS";
      if (key === "attire_motif") return "COSTUME";
      if (key === "extra_info") return "REMINDERS";
    }
    return defaultLabel;
  };

  // If contact_socials is enabled but has zero actual content, exclude it from navigation to avoid dead links
  if (enabledSet.has("contact_socials") && !hasMeaningfulContactContent(data.contact)) {
    enabledSet.delete("contact_socials");
  }

  // Filter all enabled items according to template data
  const allEnabledItems: EventNavItem[] = EVENT_APPLICABLE_SECTION_KEYS.filter((key) =>
    enabledSet.has(key)
  ).map((key) => {
    const base = EVENT_SECTION_NAV_DEFINITIONS[key];
    return {
      key,
      ...base,
      label: getAdaptedLabel(key, base.label),
    };
  });

  // Primary TopNav: Curated browsing sections (up to 5-6 items when enabled)
  const primaryNavItems: EventNavItem[] = TOP_NAV_ORDER_PREFERENCE.filter((key) =>
    enabledSet.has(key)
  ).map((key) => {
    const base = EVENT_SECTION_NAV_DEFINITIONS[key];
    return {
      key,
      ...base,
      label: getAdaptedLabel(key, base.label),
    };
  });

  // Quick Dock items: Filtered essential shortcuts (up to 5 items)
  const dockItems: EventNavItem[] = DOCK_PREFERENCE_ORDER.filter((key) => enabledSet.has(key)).map(
    (key) => {
      const base = EVENT_SECTION_NAV_DEFINITIONS[key];
      return {
        key,
        ...base,
        label: getAdaptedLabel(key, base.label),
      };
    }
  );

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

export const buildWeddingNavigation = buildEventNavigation;
