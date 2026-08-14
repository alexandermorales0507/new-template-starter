import type { CoupleData } from "@/platform/wedding-template-data";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";
import { formatEventDateLong } from "@/template/utils/event-formatting";
import { templateAssets } from "@/template/template-assets";
import { Heart, BookOpen } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Redesign freely, but keep supplied client values renderable.
// DYNAMIC COUPLE IDENTITY: Never hardcode client initials or names.

export type CoupleSectionProps = {
  data: CoupleData;
  eventDate?: string | null;
  storyEnabled?: boolean;
};

export function CoupleSection({ data, eventDate, storyEnabled = true }: CoupleSectionProps) {
  const identity = deriveCoupleIdentity(data.groomName, data.brideName);
  const heroPhoto = templateAssets.photos.hero;
  const formattedDate = formatEventDateLong(eventDate);

  const displayName =
    data.displayAs === "bride_first"
      ? `${data.brideName || identity.brideName} & ${data.groomName || identity.groomName}`
      : `${data.groomName || identity.groomName} & ${data.brideName || identity.brideName}`;

  return (
    <section id="host_info" className="template-section py-16 px-4 text-center">
      {data.hostLine && (
        <p className="text-role-subheading mb-3 uppercase tracking-wider text-xs font-semibold text-gray-500">
          {data.hostLine}
        </p>
      )}

      <h1 className="text-role-display text-gray-900 mb-4">{displayName}</h1>

      {formattedDate && (
        <p className="text-sm md:text-base font-medium text-gray-700 mb-4">{formattedDate}</p>
      )}

      {data.shortHostMessage && (
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          {data.shortHostMessage}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <a
          href="/rsvp"
          className="inline-flex items-center gap-2 py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 template-focus-ring cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-white/20" />
          <span>Reserve Your Seat</span>
        </a>

        {storyEnabled && (
          <a
            href="#story_message"
            className="inline-flex items-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95 template-focus-ring cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span>Our Story</span>
          </a>
        )}
      </div>

      {heroPhoto && (
        <div className="my-6">
          <img
            src={heroPhoto}
            alt={displayName}
            className="w-full max-w-md h-80 object-cover mx-auto rounded-lg shadow-sm border border-gray-200"
          />
        </div>
      )}
    </section>
  );
}
