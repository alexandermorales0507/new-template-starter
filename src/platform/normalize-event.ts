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
  TraditionGroup,
  DebutCourtGroup,
  GodparentsGroup,
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
  const groomName =
    stringValue(hostContent.groomName ?? raw.groomName ?? hostContent.groom) || "Groom";
  const brideName =
    stringValue(hostContent.brideName ?? raw.brideName ?? hostContent.bride) || "Bride";
  const displayAs =
    (stringValue(hostContent.displayAs) as "groom_first" | "bride_first") || "groom_first";
  const coupleData = {
    kind: "wedding" as const,
    groomName,
    brideName,
    displayAs,
    hostLine: stringValue(hostContent.hostLine) || "Together with their families",
    shortHostMessage: stringValue(hostContent.shortHostMessage ?? hostContent.message),
  };

  // 2. countdown
  const countdownContent = getSectionContent("countdown");
  const countdownData = {
    title: stringValue(countdownContent.title),
    shortNote: stringValue(countdownContent.shortNote ?? countdownContent.note),
    targetDate: stringValue(
      countdownContent.targetDate ?? raw.eventDate ?? raw.date ?? hostContent.eventDate
    ),
    enabled: boolValue(countdownContent.enabled) ?? true,
  };

  // 3. music_effects
  const musicContent = getSectionContent("music_effects");
  const musicData = {
    musicLink: stringValue(musicContent.musicLink ?? musicContent.audioUrl ?? musicContent.url),
    musicTitle: stringValue(
      musicContent.musicTitle ?? musicContent.trackTitle ?? musicContent.title
    ),
    playButtonLabel: stringValue(musicContent.playButtonLabel) || "Play Music",
    shortNote: stringValue(musicContent.shortNote ?? musicContent.note),
  };

  // 4. gallery
  const galleryContent = getSectionContent("gallery");
  const galleryData = {
    sectionTitle: stringValue(galleryContent.sectionTitle ?? galleryContent.title) || "Our Moments",
    sectionIntro: stringValue(
      galleryContent.sectionIntro ?? galleryContent.description ?? galleryContent.intro
    ),
  };

  // 5. main_event (Ceremony)
  const ceremonyContent = getSectionContent("main_event");
  const ceremonyData = {
    eventLabel:
      stringValue(ceremonyContent.eventLabel ?? ceremonyContent.title) || "The Holy Ceremony",
    eventDate: stringValue(ceremonyContent.eventDate ?? raw.eventDate ?? raw.date),
    eventTime: stringValue(ceremonyContent.eventTime ?? ceremonyContent.time),
    endTime: stringValue(ceremonyContent.endTime),
    rsvpDeadline: stringValue(
      ceremonyContent.rsvpDeadline ?? raw.rsvpDeadline ?? raw.rsvpDeadlineDate
    ),
    scheduleNote: stringValue(ceremonyContent.scheduleNote ?? ceremonyContent.note),
  };

  // 6. venue (Location)
  const venueContent = getSectionContent("venue");
  const venueData = {
    venueName:
      stringValue(venueContent.venueName ?? venueContent.name ?? ceremonyContent.venueName) ||
      "Wedding Venue",
    address:
      stringValue(venueContent.address ?? venueContent.location ?? ceremonyContent.address) ||
      "Venue Address",
    mapsLink: stringValue(
      venueContent.mapsLink ?? venueContent.googleMapsUrl ?? venueContent.mapUrl
    ),
    arrivalNote: stringValue(
      venueContent.arrivalNote ?? venueContent.note ?? venueContent.parkingNote
    ),
  };

  // 7. secondary_event (Reception)
  const receptionContent = getSectionContent("secondary_event");
  const receptionData = {
    title:
      stringValue(receptionContent.title ?? receptionContent.eventLabel) || "Dinner & Celebration",
    venueName: stringValue(receptionContent.venueName ?? venueContent.venueName),
    address: stringValue(receptionContent.address ?? venueContent.address),
    startTime: stringValue(receptionContent.startTime ?? receptionContent.time),
    endTime: stringValue(receptionContent.endTime),
    mapsLink: stringValue(receptionContent.mapsLink ?? venueContent.mapsLink),
    note: stringValue(receptionContent.note ?? receptionContent.scheduleNote),
  };

  // 8. timeline_program
  const timelineContent = getSectionContent("timeline_program");
  const rawTimelineItems = arrayOfRecords(
    timelineContent.items ?? timelineContent.events ?? timelineContent.schedule
  );
  const timelineItems: TimelineItem[] = rawTimelineItems.map((item, idx) => ({
    id: stringValue(item.id) || `timeline-${idx + 1}`,
    time: stringValue(item.time ?? item.hour) || "",
    title: stringValue(item.title ?? item.name) || "Program Item",
    description: stringValue(item.description ?? item.details ?? item.note),
  }));
  const timelineData = {
    sectionTitle:
      stringValue(timelineContent.sectionTitle ?? timelineContent.title) || "Program & Timeline",
    sectionIntro: stringValue(timelineContent.sectionIntro ?? timelineContent.intro),
    items: timelineItems,
  };

  // 9. entourage
  const entourageContent = getSectionContent("entourage");
  const rawEntourageGroups = arrayOfRecords(
    entourageContent.groups ?? entourageContent.roles ?? entourageContent.members
  );
  const entourageGroups: EntourageGroup[] = rawEntourageGroups.map((grp, idx) => {
    let namesStr = "";
    if (typeof grp.names === "string") {
      namesStr = grp.names;
    } else if (Array.isArray(grp.names)) {
      namesStr = grp.names.map((n) => (typeof n === "string" ? n : stringValue(n) || "")).join("\n");
    } else if (Array.isArray(grp.members)) {
      namesStr = grp.members.map((n) => (typeof n === "string" ? n : stringValue(n) || "")).join("\n");
    }
    return {
      id: stringValue(grp.id) || `entourage-${idx + 1}`,
      groupTitle: stringValue(grp.groupTitle ?? grp.title ?? grp.role) || "Entourage Group",
      names: namesStr,
    };
  });
  const entourageData = {
    introLine: stringValue(entourageContent.introLine ?? entourageContent.intro),
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
  } else if (Array.isArray(sponsorContent.sponsors)) {
    sponsorsNamesStr = sponsorContent.sponsors
      .map((s) => {
        if (typeof s === "string") return s;
        const sRec = record(s);
        const m = stringValue(sRec.maleSponsor ?? sRec.male ?? sRec.ninong);
        const f = stringValue(sRec.femaleSponsor ?? sRec.female ?? sRec.ninang);
        if (m && f) return `${m} & ${f}`;
        return m || f || "";
      })
      .filter(Boolean)
      .join("\n");
  }
  const sponsorsData = {
    introLine: stringValue(sponsorContent.introLine ?? sponsorContent.intro),
    names: sponsorsNamesStr,
  };

  // 11. attire_motif
  const attireContent = getSectionContent("attire_motif");
  const attireData = {
    sectionIntro: stringValue(attireContent.sectionIntro ?? attireContent.intro),
    dressCodeNote: stringValue(
      attireContent.dressCodeNote ?? attireContent.dressCodeTitle ?? attireContent.description
    ),
    colorMotifNote: stringValue(attireContent.colorMotifNote ?? attireContent.note),
  };

  // 12. extra_info
  const extraContent = getSectionContent("extra_info");
  const rawExtraItems = arrayOfRecords(extraContent.items ?? extraContent.details);
  const extraItems: ExtraInfoItem[] = rawExtraItems.map((i, idx) => ({
    id: stringValue(i.id) || `extra-${idx + 1}`,
    title: stringValue(i.title ?? i.heading) || "Note",
    details: stringValue(i.details ?? i.content ?? i.description) || "",
  }));
  const extraInfoData = {
    sectionTitle: stringValue(extraContent.sectionTitle ?? extraContent.title) || "Good to Know",
    sectionIntro: stringValue(extraContent.sectionIntro ?? extraContent.intro),
    items: extraItems,
  };

  // 13. rsvp_form
  const rsvpContent = getSectionContent("rsvp_form");
  const rsvpState = record(raw.rsvp ?? content.rsvp);
  const rsvpData = {
    enabled: boolValue(rsvpState.enabled ?? rsvpContent.enabled) ?? true,
    deadline: stringValue(rsvpState.deadline ?? rsvpContent.deadline ?? ceremonyData.rsvpDeadline),
    deadlineLabel: stringValue(
      rsvpState.deadlineLabel ?? rsvpContent.deadlineLabel ?? ceremonyData.rsvpDeadline
    ),
    note: stringValue(rsvpState.note ?? rsvpContent.note),
    plusOneEnabled: boolValue(rsvpContent.plusOneEnabled ?? rsvpContent.allowCompanions) ?? true,
    companionLimit: numberValue(rsvpContent.companionLimit, 3),
    companionNameEnabled: boolValue(rsvpContent.companionNameEnabled) ?? true,
    companionAgeEnabled: boolValue(rsvpContent.companionAgeEnabled) ?? true,
    emailEnabled: boolValue(rsvpContent.emailEnabled) ?? true,
    emailRequired: boolValue(rsvpContent.emailRequired) ?? true,
    phoneEnabled: boolValue(rsvpContent.phoneEnabled) ?? true,
    phoneRequired: boolValue(rsvpContent.phoneRequired) ?? true,
    foodAllergiesEnabled: boolValue(rsvpContent.foodAllergiesEnabled) ?? true,
    messageToHostEnabled: boolValue(rsvpContent.messageToHostEnabled) ?? true,
    customQuestions: Array.isArray(rsvpContent.customQuestions) ? rsvpContent.customQuestions : [],
  };

  // 14. gift_details (Max 2 options)
  const giftContent = getSectionContent("gift_details");
  const rawOptions = arrayOfRecords(giftContent.options);
  const giftOptions: GiftOption[] = rawOptions.slice(0, 2).map((opt, idx) => {
    const rawImage = record(opt.image);
    const imageUrl = stringValue(rawImage.url ?? opt.qrCodeUrl ?? opt.qrUrl);
    return {
      id: stringValue(opt.id) || `opt-${idx + 1}`,
      title: stringValue(opt.title ?? opt.accountType ?? opt.provider) || "Gift Option",
      accountName: stringValue(opt.accountName ?? opt.name),
      accountNumber: stringValue(opt.accountNumber ?? opt.number),
      image: imageUrl ? { url: imageUrl, alt: stringValue(rawImage.alt) || "QR Code" } : null,
    };
  });
  const giftsData = {
    sectionIntro: stringValue(giftContent.sectionIntro ?? giftContent.intro),
    giftNote: stringValue(giftContent.giftNote ?? giftContent.message ?? giftContent.note),
    options: giftOptions,
  };

  // 15. guestbook
  const guestbookContent = getSectionContent("guestbook");
  const rawMessages = arrayOfRecords(
    guestbookContent.messages ?? raw.guestbookMessages ?? content.guestbookMessages
  );
  const guestbookMessages: GuestbookMessage[] = rawMessages.map((m, idx) => ({
    id: (m.id as string | number) ?? `msg-${idx + 1}`,
    guestName: stringValue(m.guestName ?? m.name ?? m.author) || "Guest",
    message: stringValue(m.message ?? m.text) || "",
    submittedAt: stringValue(m.submittedAt ?? m.createdAt ?? m.date),
    approvedAt: stringValue(m.approvedAt),
  }));
  const guestbookData = {
    sectionTitle:
      stringValue(guestbookContent.sectionTitle ?? guestbookContent.title) || "Wishes & Blessings",
    sectionIntro: stringValue(guestbookContent.sectionIntro ?? guestbookContent.intro),
    emptyStateMessage:
      stringValue(guestbookContent.emptyStateMessage) ||
      "No approved messages yet. Check back soon!",
    messages: guestbookMessages,
  };

  // 16. story_message (Scalar narrative)
  const storyContent = getSectionContent("story_message");
  const storyData = {
    storyTitle: stringValue(storyContent.storyTitle ?? storyContent.title) || "Our Journey",
    sectionIntro: stringValue(storyContent.sectionIntro ?? storyContent.intro),
    storyBody: stringValue(
      storyContent.storyBody ??
        storyContent.message ??
        storyContent.narrative ??
        storyContent.description
    ),
  };

  // 17. contact_socials
  const contactContent = getSectionContent("contact_socials");
  const contactData = {
    contactPerson: stringValue(
      contactContent.contactPerson ?? contactContent.name ?? `${groomName} & ${brideName}`
    ),
    contactNumber: stringValue(
      contactContent.contactNumber ?? contactContent.phone ?? contactContent.mobile
    ),
    email: stringValue(contactContent.email),
    facebookUrl: stringValue(contactContent.facebookUrl ?? contactContent.facebook),
    instagramUrl: stringValue(contactContent.instagramUrl ?? contactContent.instagram),
    tikTokUrl: stringValue(contactContent.tikTokUrl ?? contactContent.tiktok),
  };

  // 18. eighteen_roses_candles
  const traditionsContent = getSectionContent("eighteen_roses_candles");
  const rawTradGroups = arrayOfRecords(traditionsContent.groups);
  const traditionGroups: TraditionGroup[] =
    rawTradGroups.length > 0
      ? rawTradGroups.map((grp, gIdx) => ({
          id: stringValue(grp.id) || `trad-grp-${gIdx + 1}`,
          title: stringValue(grp.title) || "Traditions",
          kind: stringValue(grp.kind),
          entries: arrayOfRecords(grp.entries).map((e, eIdx) => ({
            id: stringValue(e.id) || `entry-${eIdx + 1}`,
            name: stringValue(e.name) || "Participant",
            message: stringValue(e.message ?? e.role),
          })),
        }))
      : [];
  const traditionsData = {
    groups: traditionGroups,
  };

  // 19. debut_court
  const debutContent = getSectionContent("debut_court");
  const rawDebutGroups = arrayOfRecords(debutContent.groups);
  const debutGroups: DebutCourtGroup[] = rawDebutGroups.map((grp, gIdx) => ({
    id: stringValue(grp.id) || `debut-grp-${gIdx + 1}`,
    title: stringValue(grp.title) || "Court",
    names: arrayOfRecords(grp.names).map((m, mIdx) => ({
      id: stringValue(m.id) || `member-${mIdx + 1}`,
      name: stringValue(m.name) || "Member",
    })),
  }));
  const debutCourtData = {
    groups: debutGroups,
  };

  // 20. godparents
  const godparentsContent = getSectionContent("godparents");
  const rawGodparentGroups = arrayOfRecords(godparentsContent.groups);
  const godparentGroups: GodparentsGroup[] = rawGodparentGroups.map((grp, gIdx) => ({
    id: stringValue(grp.id) || `gp-grp-${gIdx + 1}`,
    title: stringValue(grp.title) || "Godparents",
    names: arrayOfRecords(grp.names).map((n, nIdx) => ({
      id: stringValue(n.id) || `gp-${nIdx + 1}`,
      name: stringValue(n.name) || "Godparent",
    })),
  }));
  const godparentsData = {
    groups: godparentGroups,
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

  const title = stringValue(raw.title ?? raw.name) || `${groomName} & ${brideName} Wedding`;
  const coupleDisplayName =
    displayAs === "bride_first" ? `${brideName} & ${groomName}` : `${groomName} & ${brideName}`;

  return {
    contractVersion: (raw.contractVersion as number) || EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    source,
    previewMode,
    eventSlug,
    title,
    coupleDisplayName,
    eventDate: stringValue(raw.eventDate ?? raw.date ?? ceremonyData.eventDate),
    eventDateLabel: stringValue(raw.eventDate ?? raw.date ?? ceremonyData.eventDate),
    eventTimeLabel: stringValue(ceremonyData.eventTime),
    eventDateTimeLabel:
      ceremonyData.eventDate && ceremonyData.eventTime
        ? `${ceremonyData.eventDate} at ${ceremonyData.eventTime}`
        : stringValue(ceremonyData.eventDate),
    rsvpDeadlineLabel: stringValue(rsvpData.deadlineLabel ?? rsvpData.deadline),
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
    traditions: traditionsData,
    debutCourt: debutCourtData,
    godparents: godparentsData,
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
