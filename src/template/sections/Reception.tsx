import type { ReceptionData } from "@/platform/wedding-template-data";
import { Clock, MapPin } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Reception (Secondary Event) details.

export function ReceptionSection({ data }: { data: ReceptionData }) {
  const timeDisplay =
    data.startTime && data.endTime
      ? `${data.startTime} – ${data.endTime}`
      : data.startTime || data.endTime;

  return (
    <section id="secondary_event" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reception</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.title || "The Celebration"}</h2>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto space-y-4">
        {timeDisplay && (
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-gray-500 shrink-0" />
            <span>{timeDisplay}</span>
          </div>
        )}
        {(data.venueName || data.address) && (
          <div className="flex items-start gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              {data.venueName && <p className="font-semibold text-gray-900">{data.venueName}</p>}
              {data.address && <p className="text-sm text-gray-600">{data.address}</p>}
            </div>
          </div>
        )}
        {data.note && (
          <p className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
            Note: {data.note}
          </p>
        )}
        {data.mapsLink && (
          <div className="pt-2">
            <a
              href={data.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 underline"
            >
              Directions to Reception &rarr;
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
