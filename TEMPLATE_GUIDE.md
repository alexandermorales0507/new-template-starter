# WebSerbisyo Custom Wedding Template Starter V2 — Authoring Guide

Welcome to the WebSerbisyo Custom Wedding Template Starter V2. This document explains how designers and AI coding tools can customize wedding templates safely while preserving protected platform capabilities.

---

## 1. Protected Boundaries (`src/platform/`)

**DO NOT MODIFY** files inside `src/platform/` during standard template authoring.

The `src/platform/` directory handles:

- Event data loading and normalization (`load-event.ts`, `normalize-event.ts`)
- Demo vs. Connected mode state management (`demo-wedding.ts`, `preview-context.ts`)
- Dynamic section visibility and section ordering (`section-visibility.ts`, `contract.ts`)
- RSVP submission handling and platform API calls (`submit-rsvp.ts`)
- Type definitions (`wedding-template-data.ts`)

---

## 2. Design Freely (`src/template/` & `public/template-assets/`)

You are encouraged to completely reimagine and redesign everything inside:

- `src/template/sections/` — Section UI components
- `src/template/components/` — Headers, footers, navigation, identity marks
- `src/template/styles/` — Colors, typography, motion, geometry tokens
- `public/template-assets/` — Local artwork, photos, icons, backgrounds

---

## 3. Authoring Guidelines

### You May

- Replace section layouts, cards, and page composition entirely
- Change colors, typography, spacing, border radii, and shadows centrally
- Add responsive animations and interaction effects
- Install compatible npm libraries (e.g. Framer Motion, Lenis, Lucide icons)
- Create specialized visual themes (e.g. Editorial, Journal, Collage, Cinematic)

### You Must

- Keep all platform data fields dynamic (`data.groomName`, `data.eventDate`, etc.)
- Respect platform section ordering (`data.enabledSectionKeys`)
- Render dynamic collections without assuming fixed counts (Timeline, Entourage, Sponsors, etc.)
- Keep RSVP submissions connected via the shared platform adapter (`submitRSVP`)
- Derive couple monograms/initials dynamically via `deriveCoupleIdentity()`
- Maintain responsive layout support and keyboard accessibility (`template-focus-ring`)

### Do Not

- Hardcode client names, dates, or initials anywhere in TSX or CSS
- Directly query Supabase or external backend databases from visual components
- Remove or bypass platform RSVP submission logic
- Fake unsupported platform features (e.g., custom RSVP questions or public guestbooks)
- Silently fallback to demo data when a live API request fails
- Scatter hardcoded hex colors or static inline styles throughout TSX files

---

## 4. Styling & Design Tokens

Theme styles are centralized in `src/template/styles/`:

- `tokens.css`: Primitive & semantic design tokens (60/30/10 surface & accent rules)
- `typography.css`: Centralized font families and text role classes (`.text-role-heading`)
- `motion.css`: Motion duration tokens and `prefers-reduced-motion` accessibility baseline
- `template.css`: Reusable neutral container, card, and focus utility classes

**Rules**:

- Use CSS tokens or Tailwind utilities instead of hardcoded hex values
- Static inline theme styles (`style={{ color: '#123456' }}`) are discouraged
- Genuinely dynamic data values (e.g., swatches from `data.colorPalette`) may remain inline
- CSS Modules are permitted for isolated visual components when necessary

---

## 5. Dynamic Couple Identity

Never hardcode client initials (e.g. "A & J"). Always use the template helper:

```tsx
// DYNAMIC COUPLE IDENTITY.
// Redesign freely, but derive initials/names from WeddingTemplateData.
// Never hardcode client initials.
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";

const identity = deriveCoupleIdentity(
  data.couple?.groomName,
  data.couple?.brideName,
  data.coupleDisplayName
);
// identity.monogram -> "A & J"
// identity.compactMonogram -> "AJ"
```

---

## 6. Local Asset Organization

Store template-specific static assets in `public/template-assets/`:

- `photos/`: Host/couple artwork and local photo placeholders
- `decorations/`: Dividers, flourishes, frames, seals
- `backgrounds/`: Textures, gradients, patterns
- `illustrations/`: Custom vector artwork
- `icons/`: Custom template icons

Register asset references in `src/template/template-assets.ts`.

---

## 7. Dependency Policy

The starter codebase remains minimal. Cloned templates may install additional npm packages (e.g. Framer Motion, Lenis) if required by the design concept.

**Rule**: Install only dependencies genuinely required by the design concept. Do not accumulate unused UI frameworks or competing animation engines.

---

## 8. Development & Employee Workflow

1. **Clone Starter**: `git clone <starter-repo>`
2. **Install Dependencies**: `npm install`
3. **Local Design**: `npm run dev` (edit `src/template/`, add assets to `public/template-assets/`)
4. **Format Code**: `npm run format`
5. **Contract Check**: `npm run check:template`
6. **Full Prebuild Verification**: `npm run verify`
7. **Production Build**: `npm run build`
8. **Live Connection Verification**: `npm run verify:connection` (tests configured real event)

### Commands Summary

- `npm run check:template`: Verifies section registry, contract version, demo data, and platform core integrity.
- `npm run verify`: Runs contract check, typecheck, linting, and formatting check.
- `npm run build`: Runs `verify` (prebuild) then `next build`. Offline-safe, no live network required.
- `npm run verify:connection`: Read-only health check for configured live WebSerbisyo API event.

If `npm run check:template` fails, read the reported missing requirement and restore the platform connection instead of removing the guardrail.
