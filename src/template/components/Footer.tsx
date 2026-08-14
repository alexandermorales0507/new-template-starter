import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { WeddingMonogram } from "./WeddingMonogram";
import { formatEventDateShort } from "@/template/utils/event-formatting";

// DYNAMIC COUPLE IDENTITY & CLEAN PUBLIC FOOTER.
// Never hardcode client initials.
// Do not expose internal developer versioning strings to wedding guests.

export function Footer({ data }: { data: WeddingTemplateData }) {
  const formattedDate = formatEventDateShort(data.ceremony?.eventDate || data.eventDate);

  return (
    <footer className="py-10 px-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
      <div className="flex flex-col items-center justify-center gap-2 mb-3">
        <WeddingMonogram
          groomName={data.couple?.groomName}
          brideName={data.couple?.brideName}
          coupleDisplayName={data.coupleDisplayName}
          variant="footer"
        />
      </div>

      {formattedDate && <p className="text-gray-600 font-medium mb-3">{formattedDate}</p>}

      <p className="text-gray-400 text-[11px] tracking-wide uppercase">Powered by WebSerbisyo</p>
    </footer>
  );
}
