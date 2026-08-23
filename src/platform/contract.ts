// PLATFORM CORE — DO NOT MODIFY FOR VISUAL DESIGN.

import contractJson from "../../contracts/event-website-sections.v1.json";

export const EVENT_WEBSITE_SECTION_CONTRACT_VERSION = 1 as const;

export type EventSectionKey =
  | "host_info"
  | "countdown"
  | "music_effects"
  | "gallery"
  | "main_event"
  | "venue"
  | "secondary_event"
  | "timeline_program"
  | "entourage"
  | "principal_sponsors"
  | "attire_motif"
  | "extra_info"
  | "rsvp_form"
  | "gift_details"
  | "guestbook"
  | "story_message"
  | "contact_socials"
  | "eighteen_roses_candles"
  | "debut_court"
  | "godparents";

export type WeddingSectionKey = EventSectionKey;

export const EVENT_APPLICABLE_SECTION_KEYS = [
  "host_info",
  "countdown",
  "music_effects",
  "gallery",
  "main_event",
  "venue",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "rsvp_form",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials",
] as const;

export const WEDDING_APPLICABLE_SECTION_KEYS = EVENT_APPLICABLE_SECTION_KEYS;

export type EventApplicableSectionKey = (typeof EVENT_APPLICABLE_SECTION_KEYS)[number];
export type WeddingApplicableSectionKey = EventApplicableSectionKey;

export const eventApplicableSectionKeySet = new Set<string>(EVENT_APPLICABLE_SECTION_KEYS);
export const weddingApplicableSectionKeySet = eventApplicableSectionKeySet;

export type SectionContractEntry = {
  key: EventSectionKey;
  label: string;
  navigationEligible: boolean;
  visibility: "optional" | "required";
};

const canonicalKeys: EventSectionKey[] = [
  "host_info",
  "countdown",
  "music_effects",
  "gallery",
  "main_event",
  "venue",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "rsvp_form",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials",
  "eighteen_roses_candles",
  "debut_court",
  "godparents",
];

export const eventWebsiteSectionContract = contractJson.sections as SectionContractEntry[];
export const eventWebsiteSectionKeys = canonicalKeys;
export const eventWebsiteSectionKeySet = new Set<string>(canonicalKeys);

export const requiredEventSections = eventWebsiteSectionContract
  .filter((entry) => entry.visibility === "required")
  .map((entry) => entry.key);

export const requiredWeddingSections = requiredEventSections;

export function validatePublicEventContract(event: Record<string, unknown>): boolean {
  const version = event.contractVersion;
  if (version !== undefined && version !== EVENT_WEBSITE_SECTION_CONTRACT_VERSION) {
    return false;
  }
  const sections = event.sections;
  if (!Array.isArray(sections) || !sections.every((key) => typeof key === "string")) {
    return true;
  }
  const unique = new Set(sections);
  return (
    unique.size === sections.length && sections.every((key) => eventWebsiteSectionKeySet.has(key))
  );
}
