import type { CeremonyData } from "@/platform/wedding-template-data";
import {
  formatEventDateLong,
  formatTimeRange,
  formatRsvpDeadline,
} from "@/template/utils/event-formatting";
import { Calendar, Clock, AlertCircle, Mail } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Main Event (Ceremony) schedule details. Venue/location is owned by the Venue section.
// Formatted in the template view layer only.

export function CeremonySection({ data }: { data: CeremonyData }) {
  const formattedDate = formatEventDateLong(data.eventDate) || "Date to be announced";
  const formattedTime = formatTimeRange(data.eventTime, data.endTime) || "Time to be announced";
  const formattedDeadline = formatRsvpDeadline(data.rsvpDeadline);

  return (
    <section
      id="main_event"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Ceremony</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.eventLabel || "The Ceremony"}</h2>
      </div>

      <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 max-w-2xl mx-auto space-y-4 shadow-xs">
        <div className="flex items-center gap-3 text-gray-800">
          <Calendar className="w-5 h-5 text-gray-500 shrink-0" />
          <span className="font-medium text-base">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-800">
          <Clock className="w-5 h-5 text-gray-500 shrink-0" />
          <span className="text-base">{formattedTime}</span>
        </div>

        {formattedDeadline && (
          <div className="flex items-center gap-3 text-sm text-gray-700 pt-2 border-t border-gray-200">
            <Mail className="w-4 h-4 text-gray-500 shrink-0" />
            <span>
              Kindly respond on or before{" "}
              <strong className="font-semibold text-gray-900">{formattedDeadline}</strong>
            </span>
          </div>
        )}

        {data.scheduleNote && (
          <div className="flex items-start gap-3 text-sm text-gray-600 pt-2 border-t border-gray-200">
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{data.scheduleNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
