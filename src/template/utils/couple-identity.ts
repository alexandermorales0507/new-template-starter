// DYNAMIC COUPLE IDENTITY.
// Redesign freely, but derive initials/names from WeddingTemplateData.
// Never hardcode client initials.

export type CoupleIdentity = {
  groomName: string;
  brideName: string;
  groomInitial: string;
  brideInitial: string;
  monogram: string;
  compactMonogram: string;
  displayName: string;
};

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

export function deriveCoupleIdentity(
  groomName?: string,
  brideName?: string,
  coupleDisplayName?: string
): CoupleIdentity {
  const groom = (groomName || "").trim();
  const bride = (brideName || "").trim();

  const groomInitial = groom ? extractInitial(groom) : "";
  const brideInitial = bride ? extractInitial(bride) : "";

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
    (groom && bride ? `${groom} & ${bride}` : groom || bride || "The Couple");

  return {
    groomName: groom,
    brideName: bride,
    groomInitial,
    brideInitial,
    monogram: monogram || "C & C",
    compactMonogram: compactMonogram || "CC",
    displayName: defaultDisplay,
  };
}
