# WebSerbisyo Custom Wedding Template Starter V2 — Authoring Guide

Welcome to the WebSerbisyo Custom Wedding Template Starter V2. This document explains how designers and AI coding tools can customize wedding templates safely while preserving protected platform capabilities.

---

## 1. Protected Boundaries (`src/platform/`)

**DO NOT MODIFY** files inside `src/platform/` during standard template authoring.

The `src/platform/` directory handles:

- Global platform contract knowledge (20 canonical section keys)
- Event data loading and normalization (`load-event.ts`, `normalize-event.ts`)
- Demo vs. Connected mode state management (`demo-wedding.ts`, `preview-context.ts`)
- Dynamic section visibility and section ordering (`section-visibility.ts`, `contract.ts`)
- RSVP submission handling and platform API calls (`submit-rsvp.ts`)
- Type definitions (`wedding-template-data.ts`)

The **Wedding Template Registry** (`src/template/section-registry.tsx`) registers exactly **17 Wedding-applicable renderers**. Non-wedding sections (`eighteen_roses_candles`, `debut_court`, `godparents`) are excluded from the wedding starter.

---

## 2. Asset & Data Ownership

| Asset / Feature        | Data / Asset Source        | Ownership & Location                             |
| ---------------------- | -------------------------- | ------------------------------------------------ |
| **Hero Photo**         | Local artwork              | `public/template-assets/photos/hero/`            |
| **Gallery Photos**     | Local/manual client photos | `public/template-assets/photos/gallery/`         |
| **Love Story Photos**  | Local/manual client photos | `public/template-assets/photos/story/`           |
| **Venue Photo**        | Local artwork              | `public/template-assets/photos/venue/`           |
| **Attire Swatches**    | Local design palette       | `src/template/template.config.ts`                |
| **Gift QR Images**     | Platform API               | Public HTTP URL from platform dashboard          |
| **Parents**            | Entourage groups           | `entourage.groups` (e.g. "Parents of the Groom") |
| **Private Access**     | Platform URL parameter     | `?access=<token>`                                |
| **Guestbook Messages** | Platform API               | Approved messages included in `PublicEventDto`   |
| **Gift Options**       | Platform API               | Maximum 2 options                                |

> **Attire Guardrail Note**:
> Attire swatches/illustrations are template-local (`template.config.ts` / CSS). Update them to match the client's approved motif before publishing. The connected `colorMotifNote` and `dressCodeNote` remain separate platform data and must remain visible.

---

## 3. Design Freely (`src/template/` & `public/template-assets/`)

You are encouraged to completely reimagine and redesign everything inside:

- `src/template/sections/` — Section UI components (17 Wedding sections)
- `src/template/components/` — Headers, footers, navigation, identity marks, quick dock, sitemap drawer
- `src/template/styles/` — Colors, typography, motion, geometry tokens
- `public/template-assets/` — Local artwork, photos, icons, backgrounds

---

## 4. Semantic Designer Contracts (17 Wedding Sections)

You may completely redesign any section visually, but preserve its connected semantic responsibilities:

1. **`host_info` (Couple)**: MUST preserve `groomName`, `brideName`, `displayAs`, `hostLine`, `shortHostMessage`. May customize hero background/layout. Dynamic monogram `J & A` is derived.
2. **`countdown`**: MUST preserve `title`, `shortNote`. Target time is derived from ceremony date/time.
3. **`music_effects`**: MUST remain a real in-page section in normal document flow. MUST preserve `musicTitle`, `shortNote`, `playButtonLabel`, `musicLink`. Controlled via shared `AudioProvider`.
4. **`gallery`**: MUST preserve `sectionTitle`, `sectionIntro`. Photos come from local `templateAssets.photos.gallery`.
5. **`main_event` (Ceremony)**: MUST preserve `eventLabel`, `eventDate`, `eventTime`, `endTime`, `scheduleNote`, and `rsvpDeadline`.
6. **`venue`**: MUST preserve `venueName`, `address`, `arrivalNote`, `mapsLink`. Local photo in `templateAssets`.
7. **`secondary_event` (Reception)**: MUST preserve `title`, `venueName`, `address`, `startTime`, `endTime`, `mapsLink`, `note`. Date display derived from `main_event`.
8. **`timeline_program`**: MUST preserve `items` (`id`, `time`, `title`, `description`) in source order. Handles 0/1/few/many items.
9. **`entourage`**: MUST preserve `introLine`, `groups` (`id`, `groupTitle`, `names`). Parses names line-by-line without splitting suffixes.
10. **`principal_sponsors`**: MUST preserve `introLine`, `names` in canonical order without inventing pairs.
11. **`attire_motif`**: MUST preserve `sectionIntro`, `dressCodeNote`, `colorMotifNote`. Swatches configured in `templateConfig.palette`.
12. **`extra_info`**: MUST preserve `sectionTitle`, `sectionIntro`, and `items` (`id`, `title`, `details`).
13. **`rsvp_form`**: MUST preserve all enabled fields (`companionLimit`, `companionNameEnabled`, food allergies, message). Submits through `submitRsvp()`.
14. **`gift_details`**: MUST preserve `sectionIntro`, `giftNote`, and max 2 options (`id`, `title`, `image.url`). Never exposes internal file paths.
15. **`guestbook`**: MUST display approved DTO messages and `emptyStateMessage`. No direct public posting.
16. **`story_message`**: MUST preserve `storyTitle`, `sectionIntro`, `storyBody`. Local photos in `templateAssets`.
17. **`contact_socials`**: MUST preserve all populated contact fields (`contactPerson`, `contactNumber`, `email`, Facebook, Instagram, TikTok).

---

## 5. Canonical Wedding Navigation Model

All navigation surfaces (Top Navbar, Floating Quick Dock, More Drawer) derive from a single navigation model generated by `buildWeddingNavigation(data)` in `src/template/navigation/wedding-navigation.ts`.

- **Disabled Section Rule**: Any section turned OFF in dashboard is automatically absent from Top Navbar, Quick Dock, and More Drawer.
- **Completeness Rule**: Every enabled navigable section is discoverable through either Primary TopNav or the More Drawer.

---

## 6. Dynamic Couple Identity & Formatting

### Monogram & Names

```tsx
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";

const identity = deriveCoupleIdentity(
  data.couple?.groomName,
  data.couple?.brideName,
  data.coupleDisplayName
);
// identity.monogram -> "J & A"
// identity.compactMonogram -> "JA"
// identity.displayName -> "John & Anne"
```

### Date & Time Formatting

```tsx
import {
  formatEventDateLong,
  formatEventDateShort,
  formatEventTime,
  formatTimeRange,
  formatRsvpDeadline,
  formatGuestbookDate,
} from "@/template/utils/event-formatting";

formatEventDateLong("2027-04-19"); // "Monday, April 19, 2027"
formatTimeRange("16:00", "17:30"); // "4:00 PM – 5:30 PM"
formatRsvpDeadline("2027-03-07T23:59"); // "March 7, 2027 at 11:59 PM"
```

---

## 7. Development Workflow & Commands

1. **Local Design**: `npm run dev` (edit `src/template/`, add assets to `public/template-assets/`)
2. **Format Code**: `npm run format`
3. **Contract Check**: `npm run check:template`
4. **Full Prebuild Verification**: `npm run verify`
5. **Production Build**: `npm run build`
6. **Live Connection Verification**: `npm run verify:connection` (read-only verification)

### Commands Summary

- `npm run check:template`: Verifies 17-wedding section registry, contract version, demo data, and platform core integrity.
- `npm run verify`: Runs contract check, typecheck, and formatting check.
- `npm run build`: Runs `verify` (prebuild) then `next build`. Offline-safe, no live network required.
- `npm run verify:connection`: Read-only health check for configured live WebSerbisyo API event.
