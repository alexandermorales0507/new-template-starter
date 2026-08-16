/**
 * Music Metadata Parser
 *
 * Extracts display title and artist from a combined music title string.
 *
 * Supports formats:
 *   "Title - Artist"
 *   "Title by Artist"
 *
 * Returns an empty displayArtist when no artist delimiter is present.
 */

export function parseMusicMeta(title?: string): {
  displayTitle: string;
  displayArtist: string;
} {
  const fallbackTitle = "Our Wedding Song";

  if (!title || !title.trim()) {
    return { displayTitle: fallbackTitle, displayArtist: "" };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.includes(" - ")) {
    const parts = trimmedTitle.split(" - ");
    return {
      displayTitle: parts[0].trim(),
      displayArtist: parts.slice(1).join(" - ").trim(),
    };
  }

  if (trimmedTitle.includes(" by ")) {
    const parts = trimmedTitle.split(" by ");
    return {
      displayTitle: parts[0].trim(),
      displayArtist: parts.slice(1).join(" by ").trim(),
    };
  }

  return { displayTitle: trimmedTitle, displayArtist: "" };
}
