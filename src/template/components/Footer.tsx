import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { deriveCoupleIdentity } from "@/template/utils/couple-identity";

// DYNAMIC COUPLE IDENTITY.
// Redesign freely, but derive initials/names from WeddingTemplateData.
// Never hardcode client initials.

export function Footer({ data }: { data: WeddingTemplateData }) {
  const identity = deriveCoupleIdentity(
    data.couple?.groomName,
    data.couple?.brideName,
    data.coupleDisplayName
  );

  return (
    <footer className="py-8 px-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
          {identity.compactMonogram}
        </span>
        <p className="font-semibold text-gray-700 text-sm">{identity.displayName}</p>
      </div>
      {data.eventDateLabel && <p className="mb-3">{data.eventDateLabel}</p>}
      <p className="text-gray-400">
        Powered by WebSerbisyo RSVP Platform &bull; Template Starter V2
      </p>
    </footer>
  );
}
