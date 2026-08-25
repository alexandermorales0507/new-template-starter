// PLATFORM DATA — KEEP DYNAMIC.
// Normalizes raw WebSerbisyo API response or local snapshot into canonical EventTemplateData (Contract V1).

import {
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionKeySet,
  requiredEventSections,
} from "./contract";
import type {
  EventTemplateData,
  NormalizedSection,
  PublicMediaAsset,
  GuestbookMessage,
  TimelineItem,
  EntourageGroup,
  ExtraInfoItem,
  GiftOption,
  RsvpData,
} from "./event-template-data";
import { isSectionEnabled } from "./section-visibility";
import { extractMilestoneNumber } from "@/template/utils/host-identity";

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
): EventTemplateData {
  const raw = record(rawInput);
  const source = options.source ?? (raw.source as "demo" | "snapshot" | "live") ?? "snapshot";
  const previewMode = options.previewMode ?? (raw.previewMode as "dashboard") ?? undefined;
  const eventSlug = stringValue(raw.eventSlug ?? raw.slug) || options.eventSlug || "event";

  const content = record(raw.content);
  const layout = record(content.layout);
  const sectionsByKey = record(raw.sectionsByKey);
  const contentSections = record(content.sections);
  const enabledSectionsMap = record(layout.enabledSections ?? raw.enabledSections);

  const sectionContentMap = new Map<string, Record<string, unknown>>();
  const sectionMap = new Map<string, NormalizedSection>();

  // Parse sections list: handle array of string keys (PublicEventDto) or array of section objects (Demo)
  if (Array.isArray(raw.sections) && raw.sections.every((item) => typeof item === "string")) {
    const keys = raw.sections as string[];
    for (const key of keys) {
      if (eventWebsiteSectionKeySet.has(key)) {
        const secObj = record(sectionsByKey[key]);
        const secContent = record(
          secObj.content ?? contentSections[key] ?? content[key] ?? raw[key]
        );
        sectionContentMap.set(key, secContent);
        sectionMap.set(key, {
          key,
          title: stringValue(secObj.title ?? secObj.label),
          enabled: boolValue(enabledSectionsMap[key]) ?? boolValue(secObj.enabled) ?? true,
          content: secContent,
        });
      }
    }
  } else if (Array.isArray(raw.sections)) {
    const rawSecObjs = arrayOfRecords(raw.sections);
    for (const s of rawSecObjs) {
      const key = stringValue(s.key);
      if (key && eventWebsiteSectionKeySet.has(key)) {
        const secContent = record(s.content ?? contentSections[key]);
        sectionContentMap.set(key, secContent);
        sectionMap.set(key, {
          key,
          title: stringValue(s.title),
          enabled: boolValue(enabledSectionsMap[key]) ?? s.enabled !== false,
          content: secContent,
        });
      }
    }
  }

  // Support both nested .content payloads and flat section objects from public API
  for (const [key, val] of Object.entries(sectionsByKey)) {
    if (!val || typeof val !== "object") continue;
    const secObj = record(val);
    const secContent = record(
      secObj.content ??
        contentSections[key] ??
        (Object.keys(secObj).length > 0 ? secObj : undefined)
    );
    sectionContentMap.set(key, secContent);
    if (!sectionMap.has(key) && eventWebsiteSectionKeySet.has(key)) {
      sectionMap.set(key, {
        key,
        title: stringValue(secObj.title),
        enabled: boolValue(enabledSectionsMap[key]) ?? secObj.enabled !== false,
        content: secContent,
      });
    }
  }

  // Also check top-level content/contentSections map
  for (const [key, val] of Object.entries({ ...content, ...contentSections })) {
    if (!sectionContentMap.has(key) && val && typeof val === "object") {
      const rec = record(val);
      sectionContentMap.set(key, rec);
      if (!sectionMap.has(key) && eventWebsiteSectionKeySet.has(key)) {
        sectionMap.set(key, {
          key,
          title: stringValue(rec.title),
          enabled: boolValue(enabledSectionsMap[key]) ?? true,
          content: rec,
        });
      }
    }
  }

  function getSectionContent(key: string): Record<string, unknown> {
    const mapped = sectionContentMap.get(key);
    if (mapped && Object.keys(mapped).length > 0) return mapped;
    const fromByKey = record(sectionsByKey[key]);
    if (fromByKey.content && typeof fromByKey.content === "object") {
      return record(fromByKey.content);
    }
    if (Object.keys(fromByKey).length > 0) {
      return fromByKey;
    }
    return record(contentSections[key]) || record(content[key]) || record(raw[key]);
  }

  // Parse sections ordering and enabled lists
  const normalizedSectionsList: NormalizedSection[] = Array.from(sectionMap.values());
  const rawOrder = Array.isArray(
    raw.orderedSectionKeys ?? raw.sectionOrder ?? layout.sectionOrder ?? raw.sections
  )
    ? (raw.orderedSectionKeys ?? raw.sectionOrder ?? layout.sectionOrder ?? raw.sections)
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
      const isEnabled = isSectionEnabled(
        key,
        normalizedSectionsList,
        stringEnabled.length > 0
          ? stringEnabled
          : Object.keys(enabledSectionsMap).filter((k) => enabledSectionsMap[k] === true)
      );
      if (isEnabled) {
        enabledSectionKeys.push(key);
        orderedSectionKeys.push(key);
      }
    }
  }

  // Ensure all required sections are present
  for (const req of requiredEventSections) {
    if (!enabledSectionKeys.includes(req)) {
      enabledSectionKeys.push(req);
    }
    if (!orderedSectionKeys.includes(req)) {
      orderedSectionKeys.push(req);
    }
  }

  // Detect event type
  const rawEventType = stringValue(raw.eventType ?? raw.eventKind ?? raw.kind ?? raw.type);
  const hostContent = getSectionContent("host_info");
  const isBirthday =
    rawEventType === "birthday" ||
    stringValue(hostContent.kind) === "birthday" ||
    Boolean(
      raw.celebrant ||
      raw.celebrantInfo ||
      hostContent.celebrantName ||
      hostContent.milestoneAge ||
      hostContent.milestone
    );
  const eventType = isBirthday ? "birthday" : rawEventType || "wedding";

  // 1. host_info (Couple / Celebrant)
  const rawCelebrant = record(raw.celebrant ?? raw.celebrantInfo);
  const celebrantName = stringValue(
    hostContent.celebrantName ??
      rawCelebrant.name ??
      rawCelebrant.celebrantName ??
      raw.celebrantName
  );
  const milestoneAge = stringValue(
    hostContent.milestoneAge ??
      hostContent.milestone ??
      hostContent.age ??
      rawCelebrant.milestoneAge ??
      rawCelebrant.milestone ??
      rawCelebrant.age ??
      raw.milestoneAge ??
      raw.milestone
  );
  const nickname = stringValue(hostContent.nickname ?? rawCelebrant.nickname ?? raw.nickname);

  let groomName = stringValue(hostContent.groomName);
  let brideName = stringValue(hostContent.brideName);
  let displayAs = stringValue(hostContent.displayAs) || "";
  let hostLine = stringValue(hostContent.hostLine) || "";
  let shortHostMessage =
    stringValue(hostContent.shortHostMessage) || stringValue(hostContent.invitationNote) || "";

  if (isBirthday || celebrantName) {
    groomName = celebrantName || groomName || "Celebrant";
    brideName = brideName || "";
    if (!displayAs) {
      displayAs = celebrantName || groomName;
    }
  } else {
    groomName = groomName || "Groom";
    brideName = brideName || "Bride";
    hostLine = hostLine || "Together with their families";
  }

  const coupleData = {
    kind: isBirthday ? "birthday" : stringValue(hostContent.kind) || "wedding",
    groomName,
    brideName,
    celebrantName,
    milestoneAge,
    nickname,
    displayAs,
    hostLine,
    shortHostMessage,
  };

  // 2. countdown
  const countdownContent = getSectionContent("countdown");
  const countdownData = {
    title: stringValue(countdownContent.title),
    shortNote: stringValue(countdownContent.shortNote),
  };

  // 3. music_effects
  const musicContent = getSectionContent("music_effects");
  const defaultMusicTitle = isBirthday ? "Party Playlist" : "Celebration Soundtrack";
  const musicData = {
    musicLink: stringValue(musicContent.musicLink),
    musicTitle: stringValue(musicContent.musicTitle) || defaultMusicTitle,
    playButtonLabel:
      stringValue(musicContent.playButtonLabel) || (isBirthday ? "Play Party Mix" : "Play Music"),
    shortNote:
      stringValue(musicContent.shortNote) ||
      (isBirthday ? "Upbeat tracks curated for the celebration." : ""),
  };

  // 4. gallery
  const galleryContent = getSectionContent("gallery");
  const galleryData = {
    sectionTitle:
      stringValue(galleryContent.sectionTitle) || (isBirthday ? "Photo Gallery" : "Our Moments"),
    sectionIntro: stringValue(galleryContent.sectionIntro),
  };

  // 5. main_event (Ceremony / Party)
  const ceremonyContent = getSectionContent("main_event");
  const defaultEventLabel = isBirthday ? "The Celebration" : "The Holy Ceremony";
  const ceremonyData = {
    eventLabel:
      stringValue(ceremonyContent.eventLabel ?? ceremonyContent.partyLabel) || defaultEventLabel,
    eventDate: stringValue(ceremonyContent.eventDate ?? raw.eventDate),
    eventTime: stringValue(ceremonyContent.eventTime ?? ceremonyContent.startTime ?? raw.eventTime),
    endTime: stringValue(ceremonyContent.endTime),
    rsvpDeadline: stringValue(ceremonyContent.rsvpDeadline),
    scheduleNote: stringValue(ceremonyContent.scheduleNote),
  };

  // 6. venue (Location)
  const venueContent = getSectionContent("venue");
  const venueData = {
    sectionTitle: stringValue(venueContent.sectionTitle),
    venueName: stringValue(venueContent.venueName ?? raw.venueName) || "Event Venue",
    address: stringValue(venueContent.address ?? raw.venueAddress) || "Venue Address",
    mapsLink: stringValue(venueContent.mapsLink),
    arrivalNote: stringValue(venueContent.arrivalNote),
  };

  // 7. secondary_event (Reception / Dinner)
  const receptionContent = getSectionContent("secondary_event");
  const defaultReceptionTitle = isBirthday ? "Dinner & Party Celebration" : "Dinner & Celebration";
  const receptionData = {
    title: stringValue(receptionContent.title) || defaultReceptionTitle,
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
  const defaultBirthdayTimeline: TimelineItem[] = [
    {
      id: "timeline-1",
      time: "18:00",
      title: "Guest Arrival & Welcome Drinks",
      description: "Guests arrive and enjoy refreshments.",
    },
    {
      id: "timeline-2",
      time: "19:00",
      title: "Dinner & Party Program",
      description: "Fun games, presentations, and dinner.",
    },
    {
      id: "timeline-3",
      time: "20:30",
      title: "Birthday Toast & Cake Cutting",
      description: "Birthday toast, cake cutting, and wishes.",
    },
  ];
  const timelineItems: TimelineItem[] =
    rawTimelineItems.length > 0
      ? rawTimelineItems.map((item, idx) => ({
          id: stringValue(item.id) || `timeline-${idx + 1}`,
          time: stringValue(item.time) || "",
          title: stringValue(item.title) || "Program Item",
          description: stringValue(item.description),
        }))
      : isBirthday
        ? defaultBirthdayTimeline
        : [];
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
    sectionTitle: stringValue(entourageContent.sectionTitle),
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
    sectionTitle: stringValue(sponsorContent.sectionTitle),
    introLine: stringValue(sponsorContent.introLine),
    names: sponsorsNamesStr,
  };

  // 11. attire_motif
  const attireContent = getSectionContent("attire_motif");
  const attireData = {
    sectionTitle: stringValue(attireContent.sectionTitle),
    sectionIntro: stringValue(attireContent.sectionIntro),
    dressCodeNote: stringValue(attireContent.dressCodeNote),
    colorMotifNote: stringValue(attireContent.colorMotifNote),
  };

  // 12. extra_info
  const extraContent = getSectionContent("extra_info");
  const rawExtraItems = arrayOfRecords(extraContent.items);
  const defaultBirthdayExtraInfo: ExtraInfoItem[] = [
    {
      id: "extra-1",
      title: "Parking & Access",
      details:
        "Ample guest parking is available near the venue entrance. Follow directional signs upon arrival.",
    },
    {
      id: "extra-2",
      title: "Welcome Drinks & Mingling",
      details: "Refreshments and snacks will be served prior to the start of the party program.",
    },
  ];
  const extraItems: ExtraInfoItem[] =
    rawExtraItems.length > 0
      ? rawExtraItems.map((i, idx) => ({
          id: stringValue(i.id) || `extra-${idx + 1}`,
          title: stringValue(i.title) || "Note",
          details: stringValue(i.details) || "",
        }))
      : isBirthday
        ? defaultBirthdayExtraInfo
        : [];
  const extraInfoData = {
    sectionTitle: stringValue(extraContent.sectionTitle) || "Additional Details",
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
  const defaultGiftOptions: GiftOption[] = [
    { id: "opt-1", title: "GCash", image: null },
    { id: "opt-2", title: "Bank Transfer", image: null },
  ];
  const giftOptions: GiftOption[] =
    rawOptions.length > 0
      ? rawOptions.slice(0, 2).map((opt, idx) => {
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
        })
      : isBirthday
        ? defaultGiftOptions
        : [];
  const defaultGiftNote = isBirthday
    ? "Your presence and celebration are the greatest gifts. If you wish to send a monetary contribution, details are provided below."
    : "Your presence is the greatest gift.";
  const giftsData = {
    sectionTitle: stringValue(giftContent.sectionTitle),
    sectionIntro: stringValue(giftContent.sectionIntro) || "Your presence is the greatest gift.",
    giftNote: stringValue(giftContent.giftNote) || defaultGiftNote,
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

  // 16. story_message (Scalar narrative / Celebrant Bio)
  const storyContent = getSectionContent("story_message");
  const defaultStoryTitle = isBirthday ? "Celebrant's Story" : "Our Story";
  const defaultStoryBody = isBirthday
    ? "We are thrilled to celebrate this special milestone together with family and friends."
    : "";
  const storyData = {
    storyTitle: stringValue(storyContent.storyTitle ?? storyContent.title) || defaultStoryTitle,
    sectionIntro: stringValue(storyContent.sectionIntro ?? storyContent.subtitle),
    storyBody:
      stringValue(
        storyContent.storyBody ?? storyContent.message ?? storyContent.celebrantMessage
      ) || defaultStoryBody,
  };

  // 17. contact_socials
  const contactContent = getSectionContent("contact_socials");
  const defaultContactPerson =
    stringValue(contactContent.contactPerson) ||
    (groomName && brideName ? `${groomName} & ${brideName}` : groomName || "");
  const contactData = {
    contactPerson: defaultContactPerson,
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

  const milestoneNumber = extractMilestoneNumber(milestoneAge);
  const defaultTitle = isBirthday
    ? milestoneNumber
      ? `${groomName}'s ${milestoneNumber}th Birthday`
      : milestoneAge
        ? `${groomName}'s ${milestoneAge}`
        : `${groomName}'s Birthday Celebration`
    : `${groomName} & ${brideName} Wedding`;
  const title = stringValue(raw.title ?? raw.eventTitle) || defaultTitle;
  const coupleDisplayName =
    displayAs ||
    (isBirthday || !brideName ? groomName || "Celebrant" : `${groomName} & ${brideName}`);

  return {
    contractVersion: (raw.contractVersion as number) || EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    source,
    previewMode,
    eventType,
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

export function normalizeEvent(input: unknown, options?: NormalizeEventOptions): EventTemplateData {
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
