import type { CeremonyData } from "@/platform/wedding-template-data";
import { Calendar, Clock, AlertCircle } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Main Event (Ceremony) schedule details. Venue/location is owned by the Venue section.

export function CeremonySection({ data }: { data: CeremonyData }) {
  const timeDisplay =
    data.eventTime && data.endTime
      ? `${data.eventTime} – ${data.endTime}`
      : data.eventTime || "Time to be announced";

  return (
    <section
      id="main_event"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Ceremony</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.eventLabel || "The Ceremony"}</h2>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="w-5 h-5 text-gray-500 shrink-0" />
          <span>{data.eventDate || "Date to be announced"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="w-5 h-5 text-gray-500 shrink-0" />
          <span>{timeDisplay}</span>
        </div>
        {data.scheduleNote && (
          <div className="flex items-start gap-3 text-sm text-gray-600 pt-2 border-t border-gray-200">
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p>{data.scheduleNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
