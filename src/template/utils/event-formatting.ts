// EVENT FORMATTING UTILITIES — TEMPLATE / VIEW LAYER ONLY.
// Pure, deterministic, SSR-safe helpers for human-friendly wedding date/time display.
// Does NOT modify canonical platform data.
// Uses local calendar component parsing to avoid UTC rollback bugs.

const MONTH_NAMES_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_NAMES_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WEEKDAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Parses YYYY-MM-DD safely into a local Date object without UTC offset shifts.
 */
function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats YYYY-MM-DD to "Monday, April 19, 2027"
 */
export function formatEventDateLong(dateStr?: string | null): string {
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr?.trim() || "";

  const weekday = WEEKDAY_NAMES_LONG[d.getDay()];
  const month = MONTH_NAMES_LONG[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  return `${weekday}, ${month} ${day}, ${year}`;
}

/**
 * Formats YYYY-MM-DD to "April 19, 2027"
 */
export function formatEventDateShort(dateStr?: string | null): string {
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr?.trim() || "";

  const month = MONTH_NAMES_LONG[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Formats YYYY-MM-DD to estate numeric style "04 — 19 — 2027"
 */
export function formatEstateDate(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];
    return `${month} — ${day} — ${year}`;
  }

  const d = parseLocalDate(dateStr);
  if (!d) return dateStr.trim();

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());

  return `${mm} — ${dd} — ${yyyy}`;
}

/**
 * Formats 24-hour time "16:00" or "16:00:00" to 12-hour "4:00 PM"
 */
export function formatEventTime(timeStr?: string | null): string {
  if (!timeStr || typeof timeStr !== "string") return "";
  const clean = timeStr.trim();
  const match = clean.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return clean;

  const hours = parseInt(match[1], 10);
  const minutes = match[2];

  if (isNaN(hours)) return clean;

  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Formats start and optional end time into a range: "4:00 PM – 5:30 PM"
 */
export function formatTimeRange(startTime?: string | null, endTime?: string | null): string {
  const start = formatEventTime(startTime);
  const end = formatEventTime(endTime);

  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

/**
 * Formats ISO or local datetime (e.g. "2027-03-07T23:59") to "March 7, 2027 at 11:59 PM"
 */
export function formatRsvpDeadline(deadlineStr?: string | null): string {
  if (!deadlineStr || typeof deadlineStr !== "string") return "";
  const clean = deadlineStr.trim();

  // If format is YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s+)(\d{1,2}):(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10);
    const minutes = match[5];

    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hours)) {
      const monthName = MONTH_NAMES_LONG[month] || "";
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${monthName} ${day}, ${year} at ${displayHours}:${minutes} ${ampm}`;
    }
  }

  // If format is date-only YYYY-MM-DD
  const dateOnly = parseLocalDate(clean);
  if (dateOnly) {
    return formatEventDateShort(clean);
  }

  return clean;
}

/**
 * Formats guestbook submittedAt/approvedAt timestamp to clean readable date "April 19, 2027"
 */
export function formatGuestbookDate(timestamp?: string | null): string {
  if (!timestamp || typeof timestamp !== "string") return "";
  const clean = timestamp.trim();

  // Handle standard ISO or YYYY-MM-DD
  const localD = parseLocalDate(clean);
  if (localD) {
    return formatEventDateShort(clean);
  }

  const parsed = new Date(clean);
  if (isNaN(parsed.getTime())) return clean;

  const month = MONTH_NAMES_LONG[parsed.getMonth()];
  const day = parsed.getDate();
  const year = parsed.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Extracts 4-digit year from date string or returns current year fallback
 */
export function extractEventYear(dateStr?: string | null): string {
  if (dateStr) {
    const match = dateStr.match(/\b(20\d{2})\b/);
    if (match) return match[1];
  }
  return new Date().getFullYear().toString();
}

/**
 * Extracts date breakdown parts for custom countdown / hero badge displays
 */
export function getEventDateParts(dateStr?: string | null) {
  const d = parseLocalDate(dateStr);
  if (!d) return null;

  return {
    weekdayLong: WEEKDAY_NAMES_LONG[d.getDay()],
    weekdayShort: WEEKDAY_NAMES_SHORT[d.getDay()],
    monthLong: MONTH_NAMES_LONG[d.getMonth()],
    monthShort: MONTH_NAMES_SHORT[d.getMonth()],
    day: d.getDate(),
    year: d.getFullYear(),
  };
}
