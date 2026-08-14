import type { CoupleData } from "@/platform/wedding-template-data";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";
import { templateAssets } from "@/template/template-assets";

// PLATFORM DATA — KEEP DYNAMIC.
// Redesign freely, but keep supplied client values renderable.

// DYNAMIC COUPLE IDENTITY.
// Never hardcode client initials or names.

export function CoupleSection({ data }: { data: CoupleData }) {
  const identity = deriveCoupleIdentity(data.groomName, data.brideName);
  const heroPhoto = templateAssets.photos.hero;

  const displayName =
    data.displayAs === "bride_first"
      ? `${data.brideName || identity.brideName} & ${data.groomName || identity.groomName}`
      : `${data.groomName || identity.groomName} & ${data.brideName || identity.brideName}`;

  return (
    <section id="host_info" className="template-section text-center">
      {data.hostLine && (
        <p className="text-role-subheading mb-3 uppercase tracking-wider text-xs font-semibold text-gray-500">
          {data.hostLine}
        </p>
      )}
      <h1 className="text-role-display text-gray-900 mb-4">{displayName}</h1>
      {data.shortHostMessage && (
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          {data.shortHostMessage}
        </p>
      )}
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
