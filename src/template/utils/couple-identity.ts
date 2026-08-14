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

export function deriveCoupleIdentity(
  groomName?: string,
  brideName?: string,
  coupleDisplayName?: string
): CoupleIdentity {
  const groom = (groomName || "").trim();
  const bride = (brideName || "").trim();

  const groomInitial = groom ? groom.charAt(0).toUpperCase() : "";
  const brideInitial = bride ? bride.charAt(0).toUpperCase() : "";

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
    const parts = coupleDisplayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0].charAt(0).toUpperCase();
      const last = parts[parts.length - 1].charAt(0).toUpperCase();
      monogram = `${first} & ${last}`;
      compactMonogram = `${first}${last}`;
    } else if (parts.length === 1) {
      monogram = parts[0].charAt(0).toUpperCase();
      compactMonogram = monogram;
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
    monogram: monogram || "C",
    compactMonogram: compactMonogram || "C",
    displayName: defaultDisplay,
  };
}
