import fs from "node:fs";
import path from "node:path";
import {
  eventWebsiteSectionContract,
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionKeySet,
  WEDDING_APPLICABLE_SECTION_KEYS,
  weddingApplicableSectionKeySet,
} from "../src/platform/contract.js";
import { templateSectionRegistry } from "../src/template/section-registry.js";
import { demoWeddingData } from "../src/platform/demo-wedding.js";
import { normalizeEventData } from "../src/platform/normalize-event.js";
import { deriveCoupleIdentity } from "../src/template/utils/couple-identity.js";
import {
  formatEventDateLong,
  formatEventTime,
  formatTimeRange,
  formatRsvpDeadline,
} from "../src/template/utils/event-formatting.js";
import {
  buildWeddingNavigation,
  resolveWeddingHref,
  hasMeaningfulContactContent,
} from "../src/template/navigation/wedding-navigation.js";

type CheckResult = {
  passed: boolean;
  failures: string[];
  warnings: string[];
};

console.log("WebSerbisyo Wedding Template Contract Check");
console.log("──────────────────────────────────────────");

const result: CheckResult = {
  passed: true,
  failures: [],
  warnings: [],
};

// 1. CONTRACT VERSION VERIFICATION
console.log("\n[1] CONTRACT VERSION VERIFICATION");
if (EVENT_WEBSITE_SECTION_CONTRACT_VERSION === 1) {
  console.log(
    `✓ Contract version: ${EVENT_WEBSITE_SECTION_CONTRACT_VERSION} (Event Website Sections V1)`
  );
} else {
  result.passed = false;
  result.failures.push(
    `Unexpected contract version: ${EVENT_WEBSITE_SECTION_CONTRACT_VERSION}. Expected 1.`
  );
  console.log(`✗ Contract version: ${EVENT_WEBSITE_SECTION_CONTRACT_VERSION}`);
}

// 2. SECTION REGISTRY & WEDDING SCOPE VALIDATION
console.log("\n[2] WEDDING SECTION REGISTRY SCOPE VALIDATION");
const globalKeys = eventWebsiteSectionContract.map((entry) => entry.key);
const weddingKeys = WEDDING_APPLICABLE_SECTION_KEYS;
const registeredKeys = Object.keys(templateSectionRegistry);

console.log(`Global contract sections: ${globalKeys.length}`);
console.log(`Wedding applicable sections: ${weddingKeys.length}`);
console.log(`Registered template section components: ${registeredKeys.length}`);

if (globalKeys.length !== 20) {
  result.passed = false;
  result.failures.push(`Global contract count mismatch. Expected 20, got ${globalKeys.length}`);
}

if (weddingKeys.length !== 17) {
  result.passed = false;
  result.failures.push(
    `Wedding applicable section count mismatch. Expected 17, got ${weddingKeys.length}`
  );
}

if (registeredKeys.length !== 17) {
  result.passed = false;
  result.failures.push(
    `Template section registry count mismatch. Expected 17, got ${registeredKeys.length}`
  );
}

let missingCount = 0;
for (const key of weddingKeys) {
  if (templateSectionRegistry[key]) {
    console.log(`  ✓ Registered Wedding Renderer: ${key}`);
  } else {
    missingCount++;
    result.failures.push(`Missing template renderer for wedding key: '${key}'`);
    console.log(`  ✗ MISSING WEDDING RENDERER: ${key}`);
  }
}

const forbiddenWeddingKeys = ["eighteen_roses_candles", "debut_court", "godparents"];
for (const key of forbiddenWeddingKeys) {
  if (templateSectionRegistry[key]) {
    result.failures.push(`Forbidden non-wedding section renderer registered: '${key}'`);
    console.log(`  ✗ FORBIDDEN RENDERER REGISTERED: ${key}`);
  }
}

for (const regKey of registeredKeys) {
  if (!weddingApplicableSectionKeySet.has(regKey)) {
    result.failures.push(
      `Unknown or non-wedding section key registered in templateSectionRegistry: '${regKey}'`
    );
    console.log(`  ✗ UNKNOWN/NON-WEDDING KEY REGISTERED: ${regKey}`);
  }
}

if (missingCount === 0 && registeredKeys.length === 17) {
  console.log(`✓ Template section registry correctly contains exactly 17 Wedding renderers.`);
} else {
  result.passed = false;
}

// 3. DEMO DATA VALIDATION
console.log("\n[3] DEMO DATA VALIDATION");
if (
  demoWeddingData &&
  demoWeddingData.eventSlug &&
  Array.isArray(demoWeddingData.enabledSectionKeys) &&
  demoWeddingData.couple &&
  demoWeddingData.ceremony &&
  demoWeddingData.venue &&
  demoWeddingData.rsvp &&
  demoWeddingData.gifts
) {
  console.log(`✓ Demo wedding dataset ('${demoWeddingData.eventSlug}') is valid and complete.`);
} else {
  result.passed = false;
  result.failures.push(
    "src/platform/demo-wedding.ts is missing required WeddingTemplateData fields."
  );
  console.log("✗ Demo wedding dataset failed validation.");
}

// Verify gift options in demo data
if (demoWeddingData.gifts?.options) {
  if (demoWeddingData.gifts.options.length > 2) {
    result.passed = false;
    result.failures.push(
      `Demo gift options exceed maximum limit of 2 (found ${demoWeddingData.gifts.options.length}).`
    );
  }
  for (const opt of demoWeddingData.gifts.options as Record<string, unknown>[]) {
    if (opt.accountName || opt.accountNumber) {
      result.passed = false;
      result.failures.push(
        `Non-canonical gift option field found in demo data: ${JSON.stringify(opt)}`
      );
    }
  }
}

// Verify non-wedding sections absent from demo section list
for (const secKey of forbiddenWeddingKeys) {
  if (demoWeddingData.enabledSectionKeys?.includes(secKey)) {
    result.passed = false;
    result.failures.push(`Forbidden non-wedding section enabled in demo data: '${secKey}'`);
  }
}

// 4. PLATFORM CORE & RSVP GUARD
console.log("\n[4] PLATFORM CORE & RSVP GUARD");
const requiredPlatformFiles = [
  "src/platform/load-event.ts",
  "src/platform/normalize-event.ts",
  "src/platform/submit-rsvp.ts",
  "src/platform/preview-context.ts",
  "src/platform/section-visibility.ts",
  "src/platform/wedding-template-data.ts",
  "src/platform/contract.ts",
  "src/platform/demo-wedding.ts",
];

for (const relPath of requiredPlatformFiles) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ Platform file present: ${relPath}`);
  } else {
    result.passed = false;
    result.failures.push(`Missing critical platform core file: ${relPath}`);
    console.log(`  ✗ MISSING PLATFORM FILE: ${relPath}`);
  }
}

// 5. DIRECT DATABASE ACCESS & API DUPLICATION GUARD
console.log("\n[5] DIRECT DATABASE & API DUPLICATION GUARD");
function scanDirForForbiddenCode(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".tsx"))) {
      const filePath = path.join(file.parentPath || file.path, file.name);
      const content = fs.readFileSync(filePath, "utf-8");

      if (content.includes("@supabase/supabase-js") || content.includes("createClient(")) {
        result.passed = false;
        result.failures.push(
          `Direct Supabase/database client usage found in template file: ${filePath}`
        );
        console.log(`  ✗ FORBIDDEN DB CLIENT: ${filePath}`);
      }

      // Check for hardcoded API calls in template visual sections
      if (
        filePath.includes("/template/sections/") &&
        !filePath.includes("RSVP.tsx") &&
        (content.includes("fetch('/api/") || content.includes('fetch("/api/'))
      ) {
        result.warnings.push(`Potential direct API fetch in visual section: ${filePath}`);
        console.log(`  ⚠ WARNING: Direct API fetch in visual section: ${filePath}`);
      }
    }
  }
}
scanDirForForbiddenCode(path.resolve(process.cwd(), "src/template"));

// 6. DYNAMIC COUPLE IDENTITY & EVENT FORMATTING GUARD
console.log("\n[6] DYNAMIC COUPLE IDENTITY & EVENT FORMATTING GUARD");
const derivedTest = deriveCoupleIdentity("Alex Rivera", "Jamie Cruz");
if (derivedTest.monogram === "A & J" && derivedTest.compactMonogram === "AJ") {
  console.log(
    "  ✓ Couple identity derivation verified: 'Alex Rivera' + 'Jamie Cruz' -> 'A & J' / 'AJ'"
  );
} else {
  result.passed = false;
  result.failures.push(
    `Couple identity derivation test failed. Got monogram '${derivedTest.monogram}'`
  );
  console.log(`  ✗ IDENTITY DERIVATION TEST FAILED: ${JSON.stringify(derivedTest)}`);
}

const formattedDateTest = formatEventDateLong("2027-04-19");
const formattedTimeTest = formatTimeRange("16:00", "17:30");
const formattedDeadlineTest = formatRsvpDeadline("2027-03-07T23:59");

if (
  formattedDateTest === "Monday, April 19, 2027" &&
  formattedTimeTest === "4:00 PM – 5:30 PM" &&
  formattedDeadlineTest.includes("March 7, 2027")
) {
  console.log("  ✓ Event formatting helpers verified (date, time range, RSVP deadline)");
} else {
  result.passed = false;
  result.failures.push("Event formatting validation failed.");
  console.log("  ✗ FORMATTING VALIDATION FAILED");
}

// 7. CANONICAL NAVIGATION MODEL GUARD
console.log("\n[7] CANONICAL NAVIGATION MODEL GUARD");
const navTest = buildWeddingNavigation(demoWeddingData);
const homeResolvedOnRoot = resolveWeddingHref("/", "/");
const homeResolvedOnSub = resolveWeddingHref("/", "/rsvp");
const sectionResolvedOnRoot = resolveWeddingHref("#timeline_program", "/");
const sectionResolvedOnSub = resolveWeddingHref("#timeline_program", "/rsvp");

if (
  navTest.primaryNavItems.length > 0 &&
  navTest.dockItems.length > 0 &&
  navTest.moreGroups.length > 0 &&
  homeResolvedOnRoot === "/" &&
  homeResolvedOnSub === "/" &&
  sectionResolvedOnRoot === "#timeline_program" &&
  sectionResolvedOnSub === "/#timeline_program"
) {
  console.log(
    `  ✓ Navigation model verified: ${navTest.primaryNavItems.length} primary links, ${navTest.dockItems.length} dock shortcuts, ${navTest.moreGroups.length} categories`
  );
  console.log("  ✓ Route-aware navigation resolver verified ('/' vs '/rsvp' resolution)");
} else {
  result.passed = false;
  result.failures.push("Canonical navigation model generator failed validation.");
  console.log("  ✗ NAVIGATION MODEL VALIDATION FAILED");
}

// 8. PROHIBITED CLIENT RESIDUE & STALE ALIAS SCAN
console.log("\n[8] PROHIBITED CLIENT RESIDUE & STALE ALIAS SCAN");
const prohibitedTerms = [
  "Princess Anne",
  "Rafael",
  "Isabella",
  "Dianne",
  "Blue Hour",
  "Template Starter V2",
];
const forbiddenFieldPatterns = [
  { pattern: "groomParents", reason: "Parent fields are not in host_info" },
  { pattern: "brideParents", reason: "Parent fields are not in host_info" },
  { pattern: "accountName", reason: "Non-canonical gift option field" },
  { pattern: "accountNumber", reason: "Non-canonical gift option field" },
];

function scanForResidueAndAliases(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && !file.name.endsWith(".gitkeep")) {
      const filePath = path.join(file.parentPath || file.path, file.name);
      if (
        filePath.includes("node_modules") ||
        filePath.includes(".next") ||
        filePath.includes("check-template-contract") ||
        filePath.includes(".git") ||
        filePath.includes("README") ||
        filePath.includes("TEMPLATE_GUIDE")
      )
        continue;
      const content = fs.readFileSync(filePath, "utf-8");
      for (const term of prohibitedTerms) {
        if (content.includes(term)) {
          result.passed = false;
          result.failures.push(`Prohibited client residue '${term}' found in: ${filePath}`);
          console.log(`  ✗ RESIDUE FOUND: '${term}' in ${filePath}`);
        }
      }
      for (const { pattern, reason } of forbiddenFieldPatterns) {
        if (content.includes(pattern)) {
          result.passed = false;
          result.failures.push(
            `Forbidden field pattern '${pattern}' found in ${filePath} (${reason})`
          );
          console.log(`  ✗ FORBIDDEN PATTERN: '${pattern}' in ${filePath}`);
        }
      }
    }
  }
}
scanForResidueAndAliases(path.resolve(process.cwd(), "src"));

// 9. REAL 17-SECTION FIELD-LEVEL SENTINEL CONNECTION VERIFICATION
console.log("\n[9] REAL 17-SECTION FIELD-LEVEL SENTINEL CONNECTION VERIFICATION");

const sentinelPublicDto = {
  eventSlug: "sentinel-wedding-slug",
  slug: "sentinel-wedding-slug",
  eventDate: "2027-09-19",
  eventTime: "15:30",
  venueName: "SENTINEL_ROOT_VENUE_NAME",
  venueAddress: "SENTINEL_ROOT_VENUE_ADDRESS",
  sections: [
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
  ],
  content: {
    layout: {
      enabledSections: {
        host_info: true,
        countdown: true,
        music_effects: true,
        gallery: true,
        main_event: true,
        venue: true,
        secondary_event: true,
        timeline_program: true,
        entourage: true,
        principal_sponsors: true,
        attire_motif: true,
        extra_info: true,
        rsvp_form: true,
        gift_details: true,
        guestbook: true,
        story_message: true,
        contact_socials: true,
      },
      sectionOrder: [
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
      ],
    },
    sections: {
      host_info: {
        groomName: "SENTINEL_GROOM",
        brideName: "SENTINEL_BRIDE",
        displayAs: "SENTINEL_DISPLAY_AS",
        hostLine: "SENTINEL_HOST_LINE",
        shortHostMessage: "SENTINEL_HOST_MESSAGE",
      },
      countdown: {
        title: "SENTINEL_COUNTDOWN_TITLE",
        shortNote: "SENTINEL_COUNTDOWN_NOTE",
      },
      music_effects: {
        musicLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        musicTitle: "SENTINEL_MUSIC_TITLE",
        playButtonLabel: "SENTINEL_PLAY_LABEL",
        shortNote: "SENTINEL_MUSIC_NOTE",
      },
      gallery: {
        sectionTitle: "SENTINEL_GALLERY_TITLE",
        sectionIntro: "SENTINEL_GALLERY_INTRO",
      },
      main_event: {
        eventLabel: "SENTINEL_CEREMONY_LABEL",
        eventDate: "2027-09-19",
        eventTime: "15:30",
        endTime: "17:00",
        rsvpDeadline: "2027-09-01T23:59:00+08:00",
        scheduleNote: "SENTINEL_SCHEDULE_NOTE",
      },
      venue: {
        venueName: "SENTINEL_VENUE_NAME",
        address: "SENTINEL_VENUE_ADDRESS",
        mapsLink: "https://maps.google.com/sentinel-venue",
        arrivalNote: "SENTINEL_ARRIVAL_NOTE",
      },
      secondary_event: {
        title: "SENTINEL_RECEPTION_TITLE",
        venueName: "SENTINEL_RECEPTION_VENUE",
        address: "SENTINEL_RECEPTION_ADDRESS",
        startTime: "18:00",
        endTime: "22:00",
        mapsLink: "https://maps.google.com/sentinel-reception",
        note: "SENTINEL_RECEPTION_NOTE",
      },
      timeline_program: {
        sectionTitle: "SENTINEL_TIMELINE_TITLE",
        sectionIntro: "SENTINEL_TIMELINE_INTRO",
        items: [
          {
            id: "sentinel-timeline-1",
            time: "15:30",
            title: "SENTINEL_ITEM_1_TITLE",
            description: "SENTINEL_ITEM_1_DESC",
          },
          {
            id: "sentinel-timeline-2",
            time: "18:00",
            title: "SENTINEL_ITEM_2_TITLE",
            description: "SENTINEL_ITEM_2_DESC",
          },
        ],
      },
      entourage: {
        introLine: "SENTINEL_ENTOURAGE_INTRO",
        groups: [
          {
            id: "sentinel-grp-1",
            groupTitle: "SENTINEL_BEST_MAN",
            names: ["SENTINEL_PERSON_1", "SENTINEL_PERSON_2"],
          },
        ],
      },
      principal_sponsors: {
        introLine: "SENTINEL_SPONSORS_INTRO",
        names: "SENTINEL_SPONSOR_1\nSENTINEL_SPONSOR_2",
      },
      attire_motif: {
        sectionIntro: "SENTINEL_ATTIRE_INTRO",
        dressCodeNote: "SENTINEL_DRESS_CODE",
        colorMotifNote: "SENTINEL_COLOR_MOTIF",
      },
      extra_info: {
        sectionTitle: "SENTINEL_EXTRA_TITLE",
        sectionIntro: "SENTINEL_EXTRA_INTRO",
        items: [
          {
            id: "sentinel-extra-1",
            title: "SENTINEL_EXTRA_1_TITLE",
            details: "SENTINEL_EXTRA_1_DETAILS",
          },
        ],
      },
      rsvp_form: {
        plusOneEnabled: true,
        companionLimit: 3,
        companionNameEnabled: true,
        companionAgeEnabled: true,
        emailEnabled: true,
        emailRequired: true,
        phoneEnabled: true,
        phoneRequired: true,
        foodAllergiesEnabled: true,
        messageToHostEnabled: true,
      },
      gift_details: {
        sectionIntro: "SENTINEL_GIFT_INTRO",
        giftNote: "SENTINEL_GIFT_NOTE",
        options: [
          {
            id: "sentinel-gift-1",
            title: "SENTINEL_GIFT_1_TITLE",
            image: {
              url: "https://cdn.example.test/sentinel-qr.png",
              path: "gifts/sentinel.png",
              alt: "SENTINEL_GIFT_ALT",
            },
          },
        ],
      },
      guestbook: {
        sectionTitle: "SENTINEL_GUESTBOOK_TITLE",
        sectionIntro: "SENTINEL_GUESTBOOK_INTRO",
        emptyStateMessage: "SENTINEL_GUESTBOOK_EMPTY",
        messages: [
          {
            id: "sentinel-msg-1",
            guestName: "SENTINEL_GUEST_NAME",
            message: "SENTINEL_GUEST_MESSAGE",
            submittedAt: "2027-09-01T10:00:00Z",
            approvedAt: "2027-09-01T11:00:00Z",
          },
        ],
      },
      story_message: {
        storyTitle: "SENTINEL_STORY_TITLE",
        sectionIntro: "SENTINEL_STORY_INTRO",
        storyBody: "SENTINEL_STORY_BODY",
      },
      contact_socials: {
        contactPerson: "SENTINEL_CONTACT_PERSON",
        contactNumber: "+639123456789",
        email: "sentinel@example.test",
        facebookUrl: "https://facebook.com/sentinel",
        instagramUrl: "https://instagram.com/sentinel",
        tikTokUrl: "https://tiktok.com/@sentinel",
      },
    },
  },
};

const normalizedSentinel = normalizeEventData(sentinelPublicDto, { source: "live" });

function assertField(actual: unknown, expected: unknown, name: string) {
  if (actual === expected) {
    console.log(`  ✓ Sentinel: ${name}`);
  } else {
    result.passed = false;
    result.failures.push(
      `Sentinel mismatch for ${name}. Expected '${String(expected)}', got '${String(actual)}'`
    );
    console.log(`  ✗ SENTINEL MISMATCH [${name}]: expected '${expected}', got '${actual}'`);
  }
}

// 1. host_info
assertField(normalizedSentinel.couple.groomName, "SENTINEL_GROOM", "host_info.groomName");
assertField(normalizedSentinel.couple.brideName, "SENTINEL_BRIDE", "host_info.brideName");
assertField(normalizedSentinel.couple.displayAs, "SENTINEL_DISPLAY_AS", "host_info.displayAs");
assertField(normalizedSentinel.couple.hostLine, "SENTINEL_HOST_LINE", "host_info.hostLine");
assertField(
  normalizedSentinel.couple.shortHostMessage,
  "SENTINEL_HOST_MESSAGE",
  "host_info.shortHostMessage"
);

// 2. countdown
assertField(normalizedSentinel.countdown.title, "SENTINEL_COUNTDOWN_TITLE", "countdown.title");
assertField(
  normalizedSentinel.countdown.shortNote,
  "SENTINEL_COUNTDOWN_NOTE",
  "countdown.shortNote"
);
assertField(
  normalizedSentinel.ceremony.eventDate,
  "2027-09-19",
  "countdown target date (from main_event.eventDate)"
);
assertField(
  normalizedSentinel.ceremony.eventTime,
  "15:30",
  "countdown target time (from main_event.eventTime)"
);

// 3. music_effects
assertField(
  normalizedSentinel.music.musicLink,
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "music_effects.musicLink"
);
assertField(
  normalizedSentinel.music.musicTitle,
  "SENTINEL_MUSIC_TITLE",
  "music_effects.musicTitle"
);
assertField(
  normalizedSentinel.music.playButtonLabel,
  "SENTINEL_PLAY_LABEL",
  "music_effects.playButtonLabel"
);
assertField(normalizedSentinel.music.shortNote, "SENTINEL_MUSIC_NOTE", "music_effects.shortNote");

// 4. gallery
assertField(
  normalizedSentinel.gallery.sectionTitle,
  "SENTINEL_GALLERY_TITLE",
  "gallery.sectionTitle"
);
assertField(
  normalizedSentinel.gallery.sectionIntro,
  "SENTINEL_GALLERY_INTRO",
  "gallery.sectionIntro"
);

// 5. main_event
assertField(
  normalizedSentinel.ceremony.eventLabel,
  "SENTINEL_CEREMONY_LABEL",
  "main_event.eventLabel"
);
assertField(normalizedSentinel.ceremony.eventDate, "2027-09-19", "main_event.eventDate");
assertField(normalizedSentinel.ceremony.eventTime, "15:30", "main_event.eventTime");
assertField(normalizedSentinel.ceremony.endTime, "17:00", "main_event.endTime");
assertField(
  normalizedSentinel.ceremony.rsvpDeadline,
  "2027-09-01T23:59:00+08:00",
  "main_event.rsvpDeadline"
);
assertField(
  normalizedSentinel.ceremony.scheduleNote,
  "SENTINEL_SCHEDULE_NOTE",
  "main_event.scheduleNote"
);

// 6. venue
assertField(normalizedSentinel.venue.venueName, "SENTINEL_VENUE_NAME", "venue.venueName");
assertField(normalizedSentinel.venue.address, "SENTINEL_VENUE_ADDRESS", "venue.address");
assertField(
  normalizedSentinel.venue.mapsLink,
  "https://maps.google.com/sentinel-venue",
  "venue.mapsLink"
);
assertField(normalizedSentinel.venue.arrivalNote, "SENTINEL_ARRIVAL_NOTE", "venue.arrivalNote");

// 7. secondary_event
assertField(
  normalizedSentinel.reception.title,
  "SENTINEL_RECEPTION_TITLE",
  "secondary_event.title"
);
assertField(
  normalizedSentinel.reception.venueName,
  "SENTINEL_RECEPTION_VENUE",
  "secondary_event.venueName"
);
assertField(
  normalizedSentinel.reception.address,
  "SENTINEL_RECEPTION_ADDRESS",
  "secondary_event.address"
);
assertField(normalizedSentinel.reception.startTime, "18:00", "secondary_event.startTime");
assertField(normalizedSentinel.reception.endTime, "22:00", "secondary_event.endTime");
assertField(
  normalizedSentinel.reception.mapsLink,
  "https://maps.google.com/sentinel-reception",
  "secondary_event.mapsLink"
);
assertField(normalizedSentinel.reception.note, "SENTINEL_RECEPTION_NOTE", "secondary_event.note");

// 8. timeline_program
assertField(
  normalizedSentinel.timeline.sectionTitle,
  "SENTINEL_TIMELINE_TITLE",
  "timeline_program.sectionTitle"
);
assertField(
  normalizedSentinel.timeline.sectionIntro,
  "SENTINEL_TIMELINE_INTRO",
  "timeline_program.sectionIntro"
);
assertField(normalizedSentinel.timeline.items.length, 2, "timeline_program.items.length");
assertField(
  normalizedSentinel.timeline.items[0]?.title,
  "SENTINEL_ITEM_1_TITLE",
  "timeline_program.items[0].title"
);
assertField(
  normalizedSentinel.timeline.items[1]?.title,
  "SENTINEL_ITEM_2_TITLE",
  "timeline_program.items[1].title"
);

// 9. entourage
assertField(
  normalizedSentinel.entourage.introLine,
  "SENTINEL_ENTOURAGE_INTRO",
  "entourage.introLine"
);
assertField(
  normalizedSentinel.entourage.groups[0]?.groupTitle,
  "SENTINEL_BEST_MAN",
  "entourage.groups[0].groupTitle"
);
assertField(
  normalizedSentinel.entourage.groups[0]?.names.includes("SENTINEL_PERSON_1"),
  true,
  "entourage.groups[0].names (person 1)"
);

// 10. principal_sponsors
assertField(
  normalizedSentinel.sponsors.introLine,
  "SENTINEL_SPONSORS_INTRO",
  "principal_sponsors.introLine"
);
assertField(
  normalizedSentinel.sponsors.names.includes("SENTINEL_SPONSOR_1"),
  true,
  "principal_sponsors.names (sponsor 1)"
);

// 11. attire_motif
assertField(
  normalizedSentinel.attire.sectionIntro,
  "SENTINEL_ATTIRE_INTRO",
  "attire_motif.sectionIntro"
);
assertField(
  normalizedSentinel.attire.dressCodeNote,
  "SENTINEL_DRESS_CODE",
  "attire_motif.dressCodeNote"
);
assertField(
  normalizedSentinel.attire.colorMotifNote,
  "SENTINEL_COLOR_MOTIF",
  "attire_motif.colorMotifNote"
);

// 12. extra_info
assertField(
  normalizedSentinel.extraInfo.sectionTitle,
  "SENTINEL_EXTRA_TITLE",
  "extra_info.sectionTitle"
);
assertField(
  normalizedSentinel.extraInfo.sectionIntro,
  "SENTINEL_EXTRA_INTRO",
  "extra_info.sectionIntro"
);
assertField(
  normalizedSentinel.extraInfo.items[0]?.title,
  "SENTINEL_EXTRA_1_TITLE",
  "extra_info.items[0].title"
);
assertField(
  normalizedSentinel.extraInfo.items[0]?.details,
  "SENTINEL_EXTRA_1_DETAILS",
  "extra_info.items[0].details"
);

// 13. rsvp_form
assertField(normalizedSentinel.rsvp.plusOneEnabled, true, "rsvp_form.plusOneEnabled");
assertField(normalizedSentinel.rsvp.companionLimit, 3, "rsvp_form.companionLimit");
assertField(normalizedSentinel.rsvp.companionNameEnabled, true, "rsvp_form.companionNameEnabled");
assertField(normalizedSentinel.rsvp.companionAgeEnabled, true, "rsvp_form.companionAgeEnabled");
assertField(normalizedSentinel.rsvp.emailEnabled, true, "rsvp_form.emailEnabled");
assertField(normalizedSentinel.rsvp.emailRequired, true, "rsvp_form.emailRequired");
assertField(normalizedSentinel.rsvp.phoneEnabled, true, "rsvp_form.phoneEnabled");
assertField(normalizedSentinel.rsvp.phoneRequired, true, "rsvp_form.phoneRequired");
assertField(normalizedSentinel.rsvp.foodAllergiesEnabled, true, "rsvp_form.foodAllergiesEnabled");
assertField(normalizedSentinel.rsvp.messageToHostEnabled, true, "rsvp_form.messageToHostEnabled");

// 14. gift_details
assertField(
  normalizedSentinel.gifts.sectionIntro,
  "SENTINEL_GIFT_INTRO",
  "gift_details.sectionIntro"
);
assertField(normalizedSentinel.gifts.giftNote, "SENTINEL_GIFT_NOTE", "gift_details.giftNote");
assertField(
  normalizedSentinel.gifts.options[0]?.title,
  "SENTINEL_GIFT_1_TITLE",
  "gift_details.options[0].title"
);
assertField(
  normalizedSentinel.gifts.options[0]?.image?.url,
  "https://cdn.example.test/sentinel-qr.png",
  "gift_details.options[0].image.url"
);

// 15. guestbook
assertField(
  normalizedSentinel.guestbook.sectionTitle,
  "SENTINEL_GUESTBOOK_TITLE",
  "guestbook.sectionTitle"
);
assertField(
  normalizedSentinel.guestbook.sectionIntro,
  "SENTINEL_GUESTBOOK_INTRO",
  "guestbook.sectionIntro"
);
assertField(
  normalizedSentinel.guestbook.emptyStateMessage,
  "SENTINEL_GUESTBOOK_EMPTY",
  "guestbook.emptyStateMessage"
);
assertField(
  normalizedSentinel.guestbook.messages[0]?.guestName,
  "SENTINEL_GUEST_NAME",
  "guestbook.messages[0].guestName"
);
assertField(
  normalizedSentinel.guestbook.messages[0]?.message,
  "SENTINEL_GUEST_MESSAGE",
  "guestbook.messages[0].message"
);

// 16. story_message
assertField(
  normalizedSentinel.story.storyTitle,
  "SENTINEL_STORY_TITLE",
  "story_message.storyTitle"
);
assertField(
  normalizedSentinel.story.sectionIntro,
  "SENTINEL_STORY_INTRO",
  "story_message.sectionIntro"
);
assertField(normalizedSentinel.story.storyBody, "SENTINEL_STORY_BODY", "story_message.storyBody");

// 17. contact_socials
assertField(
  normalizedSentinel.contact.contactPerson,
  "SENTINEL_CONTACT_PERSON",
  "contact_socials.contactPerson"
);
assertField(
  normalizedSentinel.contact.contactNumber,
  "+639123456789",
  "contact_socials.contactNumber"
);
assertField(normalizedSentinel.contact.email, "sentinel@example.test", "contact_socials.email");
assertField(
  normalizedSentinel.contact.facebookUrl,
  "https://facebook.com/sentinel",
  "contact_socials.facebookUrl"
);
assertField(
  normalizedSentinel.contact.instagramUrl,
  "https://instagram.com/sentinel",
  "contact_socials.instagramUrl"
);
assertField(
  normalizedSentinel.contact.tikTokUrl,
  "https://tiktok.com/@sentinel",
  "contact_socials.tikTokUrl"
);

// 10. CONTACT_SOCIALS FOOTER PLACEMENT & TOGGLE GUARD
console.log("\n[10] CONTACT_SOCIALS FOOTER PLACEMENT & TOGGLE GUARD");

// 10.1 Verify meaningful content detection helper
const fullContactTest = hasMeaningfulContactContent({
  contactPerson: "Alex & Jamie",
  email: "alex@example.com",
});
const emptyContactTest = hasMeaningfulContactContent({
  contactPerson: "   ",
  email: "",
  contactNumber: undefined,
});
const nullContactTest = hasMeaningfulContactContent(undefined);

if (fullContactTest && !emptyContactTest && !nullContactTest) {
  console.log("  ✓ Meaningful contact content detection helper verified");
} else {
  result.passed = false;
  result.failures.push("hasMeaningfulContactContent failed validation.");
  console.log("  ✗ CONTACT CONTENT DETECTION HELPER FAILED");
}

// 10.2 Verify navigation filtering with disabled contact_socials
const disabledContactNavTest = buildWeddingNavigation({
  ...demoWeddingData,
  enabledSectionKeys: demoWeddingData.enabledSectionKeys.filter((k) => k !== "contact_socials"),
});
const hasContactWhenDisabled = disabledContactNavTest.allEnabledItems.some(
  (item) => item.key === "contact_socials"
);

// 10.3 Verify navigation filtering with empty contact data
const emptyContactNavTest = buildWeddingNavigation({
  ...demoWeddingData,
  enabledSectionKeys: [...demoWeddingData.enabledSectionKeys, "contact_socials"],
  contact: {
    contactPerson: "",
    contactNumber: "",
    email: "",
    facebookUrl: "",
    instagramUrl: "",
    tikTokUrl: "",
  },
});
const hasContactWhenEmpty = emptyContactNavTest.allEnabledItems.some(
  (item) => item.key === "contact_socials"
);

if (!hasContactWhenDisabled && !hasContactWhenEmpty) {
  console.log(
    "  ✓ Contact navigation correctly suppressed when disabled or empty (zero dead links)"
  );
} else {
  result.passed = false;
  result.failures.push(
    "Contact navigation item was incorrectly included when section was disabled or empty."
  );
  console.log("  ✗ CONTACT NAVIGATION FILTER GUARD FAILED");
}

// 10.4 Verify TemplateRenderer filters contact_socials from in-flow rendering to prevent duplicate cards
const templateRendererSrc = fs.readFileSync(
  path.resolve(process.cwd(), "src/template/TemplateRenderer.tsx"),
  "utf-8"
);
if (
  templateRendererSrc.includes('.filter((key) => key !== "contact_socials")') ||
  templateRendererSrc.includes(".filter((key) => key !== 'contact_socials')")
) {
  console.log(
    "  ✓ Single visual placement guard verified: contact_socials filtered from in-flow <main> rendering"
  );
} else {
  result.passed = false;
  result.failures.push(
    "TemplateRenderer.tsx does not filter out contact_socials from in-flow rendering."
  );
  console.log("  ✗ IN-FLOW DUPLICATION GUARD FAILED");
}

// 11. SUMMARY
console.log("\n──────────────────────────────────────────");
if (result.warnings.length > 0) {
  console.log(`WARNINGS (${result.warnings.length}):`);
  for (const w of result.warnings) {
    console.log(`  ⚠ ${w}`);
  }
}

if (result.failures.length > 0) {
  console.log(`FAILURES (${result.failures.length}):`);
  for (const f of result.failures) {
    console.log(`  ✗ ${f}`);
  }
  console.log("\nRESULT: ✗ TEMPLATE CONTRACT CHECK FAILED");
  process.exit(1);
} else {
  console.log("RESULT: ✓ WEBSERBISYO TEMPLATE CONTRACT PASSED");
  process.exit(0);
}
