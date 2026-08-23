// DYNAMIC HOST / CELEBRANT / COUPLE IDENTITY.
// Redesign freely, but derive initials/names from EventTemplateData.
// Never hardcode client initials.

export type HostIdentity = {
  groomName: string;
  brideName: string;
  groomInitial: string;
  brideInitial: string;
  monogram: string;
  compactMonogram: string;
  displayName: string;
};

export type CoupleIdentity = HostIdentity;

const COMMON_TITLES = new Set(["dr", "mr", "mrs", "ms", "prof", "rev", "atty", "engr", "hon"]);

function cleanName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && COMMON_TITLES.has(parts[0].toLowerCase().replace(/\./g, ""))) {
    return parts.slice(1).join(" ");
  }
  return name.trim();
}

function extractInitial(name: string): string {
  const cleaned = cleanName(name);
  const match = cleaned.match(/[\p{L}]/u);
  return match ? match[0].toUpperCase() : "";
}

/**
 * Extracts a milestone number from a milestone or age string.
 * Examples:
 * - "30th birthday" -> "30"
 * - "Level 10" -> "10"
 * - "Turning 18" -> "18"
 * - "10" -> "10"
 */
export function extractMilestoneNumber(milestone?: string | null): string | null {
  if (!milestone) return null;
  const match = String(milestone).trim().match(/(\d+)/);
  return match ? match[1] : null;
}

export function deriveHostIdentity(
  groomName?: string,
  brideName?: string,
  coupleDisplayName?: string
): HostIdentity {
  const groom = (groomName || "").trim();
  const bride = (brideName || "").trim();

  // If brideName is numeric (e.g. "10" for 10th birthday) or matches groomName, treat as single host
  const isBrideNumeric = /^\d+$/.test(bride);
  const isSingleHost = !bride || isBrideNumeric || groom.toLowerCase() === bride.toLowerCase();

  const groomInitial = groom ? extractInitial(groom) : "";
  const brideInitial = !isSingleHost && bride ? extractInitial(bride) : "";

  let monogram = "";
  let compactMonogram = "";

  if (groomInitial && brideInitial) {
    monogram = `${groomInitial} & ${brideInitial}`;
    compactMonogram = `${groomInitial}${brideInitial}`;
  } else if (groomInitial) {
    monogram = groomInitial;
    compactMonogram = groomInitial;
  } else if (brideInitial) {
    monogram = brideInitial;
    compactMonogram = brideInitial;
  } else if (coupleDisplayName && coupleDisplayName.trim().length > 0) {
    const cleanDisplay = coupleDisplayName.trim();
    // Check for couple delimiters: &, and, +, /
    const segments = cleanDisplay.split(/\s+(?:&|and|\+|\/)\s+/i);
    if (segments.length === 2) {
      const first = extractInitial(segments[0]);
      const second = extractInitial(segments[1]);
      if (first && second) {
        monogram = `${first} & ${second}`;
        compactMonogram = `${first}${second}`;
      }
    }
    if (!monogram) {
      const parts = cleanDisplay.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        const first = extractInitial(parts[0]);
        const last = extractInitial(parts[parts.length - 1]);
        monogram = `${first} & ${last}`;
        compactMonogram = `${first}${last}`;
      } else if (parts.length === 1) {
        monogram = extractInitial(parts[0]);
        compactMonogram = monogram;
      }
    }
  }

  const defaultDisplay =
    coupleDisplayName?.trim() ||
    (!isSingleHost && groom && bride ? `${groom} & ${bride}` : groom || bride || "The Celebrant");

  return {
    groomName: groom,
    brideName: isSingleHost ? "" : bride,
    groomInitial,
    brideInitial,
    monogram: monogram || "M",
    compactMonogram: compactMonogram || "M",
    displayName: defaultDisplay,
  };
}

export const deriveCoupleIdentity = deriveHostIdentity;
