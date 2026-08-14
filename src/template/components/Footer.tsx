import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { WeddingMonogram } from "./WeddingMonogram";
import { extractEventYear } from "@/template/utils/event-formatting";
import { Mail, Phone, Globe } from "lucide-react";

// DYNAMIC COUPLE IDENTITY & CLEAN CLOSING SURFACE.
// Generalized 3-zone closing hierarchy.
// Respects contact_socials section toggle state.

export function Footer({ data }: { data: WeddingTemplateData }) {
  const eventYear = extractEventYear(data.ceremony?.eventDate || data.eventDate);
  const coupleName = data.coupleDisplayName || "The Couple";

  const isContactEnabled =
    data.enabledSectionKeys?.includes("contact_socials") && Boolean(data.contact);

  const email = isContactEnabled ? data.contact?.email : null;
  const phone = isContactEnabled ? data.contact?.contactNumber : null;
  const facebookUrl = isContactEnabled ? data.contact?.facebookUrl?.trim() : null;
  const instagramUrl = isContactEnabled ? data.contact?.instagramUrl?.trim() : null;
  const tikTokUrl = isContactEnabled ? data.contact?.tikTokUrl?.trim() : null;

  const hasContactInfo = Boolean(email || phone);
  const hasSocials = Boolean(facebookUrl || instagramUrl || tikTokUrl);

  return (
    <footer className="wedding-footer pt-12 pb-28 sm:pb-32 px-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
      <div className="max-w-5xl mx-auto">
        {/* Upper Closing Grid */}
        <div
          className={`grid grid-cols-1 ${
            hasContactInfo || hasSocials
              ? hasSocials && hasContactInfo
                ? "md:grid-cols-3"
                : "md:grid-cols-2"
              : "grid-cols-1"
          } gap-8 items-center text-center ${
            hasContactInfo || hasSocials ? "md:text-left" : "text-center"
          }`}
        >
          {/* Column 1: Identity */}
          <div className="flex flex-col items-center md:items-start justify-center gap-1.5 select-none">
            <WeddingMonogram
              groomName={data.couple?.groomName}
              brideName={data.couple?.brideName}
              coupleDisplayName={data.coupleDisplayName}
              variant="footer"
            />
          </div>

          {/* Column 2: Connected Contact Channels (When enabled) */}
          {hasContactInfo && (
            <div className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-700">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Inquiries &amp; Information
              </span>
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Column 3: Connected Social Links (When enabled) */}
          {hasSocials && (
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Social Channels
              </span>
              <div className="flex items-center gap-3">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full border border-gray-200 text-blue-600 hover:scale-105 transition-transform shadow-xs template-focus-ring"
                    aria-label="Facebook"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full border border-gray-200 text-pink-600 hover:scale-105 transition-transform shadow-xs template-focus-ring"
                    aria-label="Instagram"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {tikTokUrl && (
                  <a
                    href={tikTokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full border border-gray-200 text-gray-900 hover:scale-105 transition-transform shadow-xs template-focus-ring"
                    aria-label="TikTok"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Strip */}
        <div className="w-full h-px bg-gray-200 my-8" />

        <div className="text-center text-xs text-gray-500 tracking-wider flex flex-col gap-1">
          <p>
            &copy; {eventYear} {coupleName}. All rights reserved.
          </p>
          <p className="text-[11px]">
            Custom RSVP by{" "}
            <a
              href="https://rsvp.webserbisyo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline font-semibold"
            >
              WebSerbisyo
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
