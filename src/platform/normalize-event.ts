// PLATFORM DATA — KEEP DYNAMIC.
// Normalizes raw WebSerbisyo API response or local snapshot into canonical WeddingTemplateData (Contract V1).

import {
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionKeySet,
  requiredWeddingSections,
} from "./contract";
import type {
  WeddingTemplateData,
  NormalizedSection,
  PublicMediaAsset,
  GuestbookMessage,
  TimelineItem,
  EntourageGroup,
  ExtraInfoItem,
  GiftOption,
  RsvpData,
} from "./wedding-template-data";
import { isSectionEnabled } from "./section-visibility";

function record(val: unknown): Record<string, unknown> {
  return val && typeof val === "object" && !Array.isArray(val)
    ? (val as Record<string, unknown>)
    : {};
}

function arrayOfRecords(val: unknown): Record<string, unknown>[] {
  if (!Array.isArray(val)) return [];
  return val.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
}

function stringValue(val: unknown): string | undefined {
  if (typeof val === "string") return val.trim() || undefined;
  if (typeof val === "number") return String(val);
  return undefined;
}

function boolValue(val: unknown): boolean | undefined {
  if (typeof val === "boolean") return val;
  if (val === "true" || val === "1") return true;
  if (val === "false" || val === "0") return false;
  return undefined;
}

function numberValue(val: unknown, fallback: number = 0): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

export type NormalizeEventOptions = {
  source?: "demo" | "snapshot" | "live";
  previewMode?: "dashboard";
  eventSlug?: string;
};

export function normalizeEventData(
  rawInput: unknown,
  options: NormalizeEventOptions = {}
): WeddingTemplateData {
  const raw = record(rawInput);
  const source = options.source ?? (raw.source as "demo" | "snapshot" | "live") ?? "snapshot";
  const previewMode = options.previewMode ?? (raw.previewMode as "dashboard") ?? undefined;
  const eventSlug = stringValue(raw.eventSlug ?? raw.slug) || options.eventSlug || "event";

  const content = record(raw.content);
  const rawSections = arrayOfRecords(raw.sections);

  // Index sections by key
  const sectionContentMap = new Map<string, Record<string, unknown>>();
  const sectionMap = new Map<string, NormalizedSection>();

  for (const s of rawSections) {
    const key = stringValue(s.key);
    if (key) {
      const secContent = record(s.content);
      sectionContentMap.set(key, secContent);
      sectionMap.set(key, {
        key,
        title: stringValue(s.title),
        enabled: s.enabled !== false,
        content: secContent,
      });
    }
  }

  // Also check top-level content map
  for (const [key, val] of Object.entries(content)) {
    if (!sectionContentMap.has(key) && val && typeof val === "object") {
      const rec = record(val);
      sectionContentMap.set(key, rec);
      if (!sectionMap.has(key)) {
        sectionMap.set(key, {
          key,
          title: stringValue(rec.title),
          enabled: true,
          content: rec,
        });
      }
    }
  }

  function getSectionContent(key: string): Record<string, unknown> {
    return sectionContentMap.get(key) || record(content[key]) || record(raw[key]);
  }

  // Parse sections list
  const normalizedSectionsList: NormalizedSection[] = Array.from(sectionMap.values());
  const rawOrder = Array.isArray(raw.orderedSectionKeys ?? raw.sectionOrder)
    ? (raw.orderedSectionKeys ?? raw.sectionOrder)
    : [];
  const rawEnabled = Array.isArray(raw.enabledSectionKeys ?? raw.enabledSections)
    ? (raw.enabledSectionKeys ?? raw.enabledSections)
    : [];

  const stringOrder = (rawOrder as unknown[])
    .map((k) => (typeof k === "string" ? k : ""))
    .filter((k) => eventWebsiteSectionKeySet.has(k));
  const stringEnabled = (rawEnabled as unknown[])
    .map((k) => (typeof k === "string" ? k : ""))
    .filter((k) => eventWebsiteSectionKeySet.has(k));

  // Determine enabled keys
  const enabledSectionKeys: string[] = [];
  const orderedSectionKeys: string[] = [];

  // Default ordering base
  const candidateKeys =
    stringOrder.length > 0 ? stringOrder : normalizedSectionsList.map((s) => s.key);

  const seen = new Set<string>();
  for (const key of candidateKeys) {
    if (!seen.has(key) && eventWebsiteSectionKeySet.has(key)) {
      seen.add(key);
      const isEnabled = isSectionEnabled(key, normalizedSectionsList, stringEnabled);
      if (isEnabled) {
        enabledSectionKeys.push(key);
        orderedSectionKeys.push(key);
      }
    }
  }

  // Ensure all required sections are present
  for (const req of requiredWeddingSections) {
    if (!enabledSectionKeys.includes(req)) {
      enabledSectionKeys.push(req);
    }
    if (!orderedSectionKeys.includes(req)) {
      orderedSectionKeys.push(req);
    }
  }

  // 1. host_info (Couple)
  const hostContent = getSectionContent("host_info");
  const groomName = stringValue(hostContent.groomName) || "Groom";
  const brideName = stringValue(hostContent.brideName) || "Bride";
  const displayAs = stringValue(hostContent.displayAs) || "";
  const coupleData = {
    kind: "wedding" as const,
    groomName,
    brideName,
    displayAs,
    hostLine: stringValue(hostContent.hostLine) || "Together with their families",
    shortHostMessage: stringValue(hostContent.shortHostMessage) || "",
  };

  // 2. countdown
  const countdownContent = getSectionContent("countdown");
  const countdownData = {
    title: stringValue(countdownContent.title),
    shortNote: stringValue(countdownContent.shortNote),
  };

  // 3. music_effects
  const musicContent = getSectionContent("music_effects");
  const musicData = {
    musicLink: stringValue(musicContent.musicLink),
    musicTitle: stringValue(musicContent.musicTitle),
    playButtonLabel: stringValue(musicContent.playButtonLabel) || "Play Music",
    shortNote: stringValue(musicContent.shortNote),
  };

  // 4. gallery
  const galleryContent = getSectionContent("gallery");
  const galleryData = {
    sectionTitle: stringValue(galleryContent.sectionTitle) || "Our Moments",
    sectionIntro: stringValue(galleryContent.sectionIntro),
  };

  // 5. main_event (Ceremony)
  const ceremonyContent = getSectionContent("main_event");
  const ceremonyData = {
    eventLabel: stringValue(ceremonyContent.eventLabel) || "The Holy Ceremony",
    eventDate: stringValue(ceremonyContent.eventDate ?? raw.eventDate),
    eventTime: stringValue(ceremonyContent.eventTime ?? raw.eventTime),
    endTime: stringValue(ceremonyContent.endTime),
    rsvpDeadline: stringValue(ceremonyContent.rsvpDeadline),
    scheduleNote: stringValue(ceremonyContent.scheduleNote),
  };

  // 6. venue (Location)
  const venueContent = getSectionContent("venue");
  const venueData = {
    venueName: stringValue(venueContent.venueName ?? raw.venueName) || "Wedding Venue",
    address: stringValue(venueContent.address ?? raw.venueAddress) || "Venue Address",
    mapsLink: stringValue(venueContent.mapsLink),
    arrivalNote: stringValue(venueContent.arrivalNote),
  };

  // 7. secondary_event (Reception)
  const receptionContent = getSectionContent("secondary_event");
  const receptionData = {
    title: stringValue(receptionContent.title) || "Dinner & Celebration",
    venueName: stringValue(receptionContent.venueName),
    address: stringValue(receptionContent.address),
    startTime: stringValue(receptionContent.startTime),
    endTime: stringValue(receptionContent.endTime),
    mapsLink: stringValue(receptionContent.mapsLink),
    note: stringValue(receptionContent.note),
  };

  // 8. timeline_program
  const timelineContent = getSectionContent("timeline_program");
  const rawTimelineItems = arrayOfRecords(timelineContent.items);
  const timelineItems: TimelineItem[] = rawTimelineItems.map((item, idx) => ({
    id: stringValue(item.id) || `timeline-${idx + 1}`,
    time: stringValue(item.time) || "",
    title: stringValue(item.title) || "Program Item",
    description: stringValue(item.description),
  }));
  const timelineData = {
    sectionTitle: stringValue(timelineContent.sectionTitle) || "Program & Timeline",
    sectionIntro: stringValue(timelineContent.sectionIntro),
    items: timelineItems,
  };

  // 9. entourage
  const entourageContent = getSectionContent("entourage");
  const rawEntourageGroups = arrayOfRecords(entourageContent.groups);
  const entourageGroups: EntourageGroup[] = rawEntourageGroups.map((grp, idx) => {
    let namesStr = "";
    if (typeof grp.names === "string") {
      namesStr = grp.names;
    } else if (Array.isArray(grp.names)) {
      namesStr = grp.names
        .map((n) => (typeof n === "string" ? n : stringValue(n) || ""))
        .join("\n");
    }
    return {
      id: stringValue(grp.id) || `entourage-${idx + 1}`,
      groupTitle: stringValue(grp.groupTitle) || "Entourage Group",
      names: namesStr,
    };
  });
  const entourageData = {
    introLine: stringValue(entourageContent.introLine),
    groups: entourageGroups,
  };

  // 10. principal_sponsors
  const sponsorContent = getSectionContent("principal_sponsors");
  let sponsorsNamesStr = "";
  if (typeof sponsorContent.names === "string") {
    sponsorsNamesStr = sponsorContent.names;
  } else if (Array.isArray(sponsorContent.names)) {
    sponsorsNamesStr = sponsorContent.names
      .map((n) => (typeof n === "string" ? n : stringValue(n) || ""))
      .join("\n");
  }
  const sponsorsData = {
    introLine: stringValue(sponsorContent.introLine),
    names: sponsorsNamesStr,
  };

  // 11. attire_motif
  const attireContent = getSectionContent("attire_motif");
  const attireData = {
    sectionIntro: stringValue(attireContent.sectionIntro),
    dressCodeNote: stringValue(attireContent.dressCodeNote),
    colorMotifNote: stringValue(attireContent.colorMotifNote),
  };

  // 12. extra_info
  const extraContent = getSectionContent("extra_info");
  const rawExtraItems = arrayOfRecords(extraContent.items);
  const extraItems: ExtraInfoItem[] = rawExtraItems.map((i, idx) => ({
    id: stringValue(i.id) || `extra-${idx + 1}`,
    title: stringValue(i.title) || "Note",
    details: stringValue(i.details) || "",
  }));
  const extraInfoData = {
    sectionTitle: stringValue(extraContent.sectionTitle) || "Good to Know",
    sectionIntro: stringValue(extraContent.sectionIntro),
    items: extraItems,
  };

  // 13. rsvp_form
  const rsvpContent = getSectionContent("rsvp_form");
  const rsvpData: RsvpData = {
    plusOneEnabled: boolValue(rsvpContent.plusOneEnabled) ?? false,
    companionLimit: numberValue(rsvpContent.companionLimit, 1),
    companionNameEnabled: boolValue(rsvpContent.companionNameEnabled) ?? true,
    companionAgeEnabled: boolValue(rsvpContent.companionAgeEnabled) ?? false,
    emailEnabled: boolValue(rsvpContent.emailEnabled) ?? true,
    emailRequired: boolValue(rsvpContent.emailRequired) ?? true,
    phoneEnabled: boolValue(rsvpContent.phoneEnabled) ?? false,
    phoneRequired: boolValue(rsvpContent.phoneRequired) ?? false,
    foodAllergiesEnabled: boolValue(rsvpContent.foodAllergiesEnabled) ?? false,
    messageToHostEnabled: boolValue(rsvpContent.messageToHostEnabled) ?? true,
    customQuestions: Array.isArray(rsvpContent.customQuestions) ? rsvpContent.customQuestions : [],
  };

  // 14. gift_details (Max 2 options)
  const giftContent = getSectionContent("gift_details");
  const rawOptions = arrayOfRecords(giftContent.options);
  const giftOptions: GiftOption[] = rawOptions.slice(0, 2).map((opt, idx) => {
    const rawImage = record(opt.image);
    const imageUrl = stringValue(rawImage.url);
    const imagePath = stringValue(rawImage.path) || "";
    return {
      id: stringValue(opt.id) || `opt-${idx + 1}`,
      title: stringValue(opt.title) || "Gift Option",
      image:
        imageUrl || imagePath
          ? { path: imagePath, url: imageUrl, alt: stringValue(rawImage.alt) }
          : null,
    };
  });
  const giftsData = {
    sectionIntro: stringValue(giftContent.sectionIntro),
    giftNote: stringValue(giftContent.giftNote),
    options: giftOptions,
  };

  // 15. guestbook
  const guestbookContent = getSectionContent("guestbook");
  const rawMessages = arrayOfRecords(
    raw.publicGuestbookMessages ??
      raw.guestbookMessages ??
      content.publicGuestbookMessages ??
      content.guestbookMessages ??
      guestbookContent.messages
  );
  const guestbookMessages: GuestbookMessage[] = rawMessages.map((m, idx) => ({
    id: (m.id as string | number) ?? `msg-${idx + 1}`,
    guestName: stringValue(m.guestName ?? m.name) || "Guest",
    message: stringValue(m.message) || "",
    submittedAt: stringValue(m.submittedAt ?? m.createdAt),
    approvedAt: stringValue(m.approvedAt),
  }));
  const guestbookData = {
    sectionTitle: stringValue(guestbookContent.sectionTitle) || "Wishes & Blessings",
    sectionIntro: stringValue(guestbookContent.sectionIntro),
    emptyStateMessage:
      stringValue(guestbookContent.emptyStateMessage) ||
      "Approved guest messages will appear here soon.",
    messages: guestbookMessages,
  };

  // 16. story_message (Scalar narrative)
  const storyContent = getSectionContent("story_message");
  const storyData = {
    storyTitle: stringValue(storyContent.storyTitle) || "Our Journey",
    sectionIntro: stringValue(storyContent.sectionIntro),
    storyBody: stringValue(storyContent.storyBody),
  };

  // 17. contact_socials
  const contactContent = getSectionContent("contact_socials");
  const contactData = {
    contactPerson:
      stringValue(contactContent.contactPerson) ||
      (groomName && brideName ? `${groomName} & ${brideName}` : ""),
    contactNumber: stringValue(contactContent.contactNumber),
    email: stringValue(contactContent.email),
    facebookUrl: stringValue(contactContent.facebookUrl),
    instagramUrl: stringValue(contactContent.instagramUrl),
    tikTokUrl: stringValue(contactContent.tikTokUrl),
  };

  // Assets Map
  const assetsRecord: Record<string, PublicMediaAsset> = {};
  const rawAssets = raw.assets;
  if (Array.isArray(rawAssets)) {
    for (const item of rawAssets) {
      if (item && typeof item === "object") {
        const itemRec = record(item);
        const slot = stringValue(itemRec.slot);
        if (slot) {
          assetsRecord[slot] = {
            slot,
            url: stringValue(itemRec.url ?? itemRec.src),
            alt: stringValue(itemRec.alt),
          };
        }
      }
    }
  } else if (rawAssets && typeof rawAssets === "object") {
    for (const [key, val] of Object.entries(rawAssets)) {
      if (typeof val === "string") {
        assetsRecord[key] = { slot: key, url: val };
      } else if (val && typeof val === "object") {
        const valRec = record(val);
        assetsRecord[key] = {
          slot: key,
          url: stringValue(valRec.url ?? valRec.src),
          alt: stringValue(valRec.alt),
        };
      }
    }
  }

  const title = stringValue(raw.title ?? raw.eventTitle) || `${groomName} & ${brideName} Wedding`;
  const coupleDisplayName =
    displayAs ||
    (groomName && brideName
      ? `${groomName} & ${brideName}`
      : groomName || brideName || "The Couple");

  return {
    contractVersion: (raw.contractVersion as number) || EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    source,
    previewMode,
    eventSlug,
    title,
    coupleDisplayName,
    eventDate: stringValue(raw.eventDate ?? ceremonyData.eventDate),
    eventDateLabel: stringValue(raw.eventDateLabel ?? raw.eventDate ?? ceremonyData.eventDate),
    eventTimeLabel: stringValue(raw.eventTimeLabel ?? ceremonyData.eventTime),
    eventDateTimeLabel:
      stringValue(raw.eventDateTimeLabel) ||
      (ceremonyData.eventDate && ceremonyData.eventTime
        ? `${ceremonyData.eventDate} at ${ceremonyData.eventTime}`
        : stringValue(ceremonyData.eventDate)),
    rsvpDeadlineLabel: stringValue(raw.rsvpDeadlineLabel ?? ceremonyData.rsvpDeadline),
    timezone: stringValue(raw.timezone),
    publicUrl: stringValue(raw.publicUrl),

    couple: coupleData,
    countdown: countdownData,
    music: musicData,
    ceremony: ceremonyData,
    venue: venueData,
    reception: receptionData,
    timeline: timelineData,
    entourage: entourageData,
    sponsors: sponsorsData,
    attire: attireData,
    extraInfo: extraInfoData,
    rsvp: rsvpData,
    gifts: giftsData,
    guestbook: guestbookData,
    story: storyData,
    contact: contactData,
    gallery: galleryData,

    sections: normalizedSectionsList,
    orderedSectionKeys,
    enabledSectionKeys,

    assets: assetsRecord,
    raw,
  };
}

export function normalizeEvent(
  input: unknown,
  options?: NormalizeEventOptions
): WeddingTemplateData {
  if (input && typeof input === "object" && "raw" in input) {
    const wrapper = input as {
      raw: unknown;
      source?: "demo" | "snapshot" | "live";
      previewMode?: "dashboard";
      eventSlug?: string;
    };
    return normalizeEventData(wrapper.raw, {
      source: wrapper.source,
      previewMode: wrapper.previewMode,
      eventSlug: wrapper.eventSlug,
      ...options,
    });
  }
  return normalizeEventData(input, options);
}
