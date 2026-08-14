import type { VenueData } from "@/platform/wedding-template-data";
import { MapPin, Info } from "lucide-react";
import { templateAssets } from "@/template/template-assets";

// PLATFORM DATA — KEEP DYNAMIC.
// Venue details. Visual photo is managed as a local template asset.

export function VenueSection({ data }: { data: VenueData }) {
  const venuePhoto = templateAssets.photos.venue;

  return (
    <section
      id="venue"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Venue</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.venueName || "Location"}</h2>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto space-y-4 text-center">
        {venuePhoto && (
          <img
            src={venuePhoto}
            alt={data.venueName || "Venue"}
            className="w-full h-64 object-cover rounded-md mb-4 border border-gray-200"
          />
        )}
        <div className="flex items-start justify-center gap-2 text-gray-700">
          <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">{data.address}</p>
        </div>
        {data.arrivalNote && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <Info className="w-4 h-4 text-gray-400 shrink-0" />
            <p>{data.arrivalNote}</p>
          </div>
        )}
        {data.mapsLink && (
          <div className="pt-2">
            <a
              href={data.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 underline"
            >
              Open in Maps &rarr;
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
