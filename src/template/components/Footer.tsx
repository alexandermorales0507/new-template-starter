import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { WeddingMonogram } from "./WeddingMonogram";
import { extractEventYear } from "@/template/utils/event-formatting";
import { Mail, Phone, Globe, User } from "lucide-react";

// DYNAMIC COUPLE IDENTITY & RESPONSIVE CLOSING SURFACE.
// Supports both FULL FOOTER MODE (when contact_socials is enabled with content)
// and COMPACT FOOTER MODE (when disabled or empty, preventing empty visual space).

export function Footer({ data }: { data: WeddingTemplateData }) {
  const eventYear = extractEventYear(data.ceremony?.eventDate || data.eventDate);
  const coupleName = data.coupleDisplayName || "The Couple";

  const isContactEnabled =
    Boolean(data.enabledSectionKeys?.includes("contact_socials")) && Boolean(data.contact);

  const contactPerson = data.contact?.contactPerson?.trim() || null;
  const email = isContactEnabled ? data.contact?.email?.trim() || null : null;
  const phone = isContactEnabled ? data.contact?.contactNumber?.trim() || null : null;
  const facebookUrl = isContactEnabled ? data.contact?.facebookUrl?.trim() || null : null;
  const instagramUrl = isContactEnabled ? data.contact?.instagramUrl?.trim() || null : null;
  const tikTokUrl = isContactEnabled ? data.contact?.tikTokUrl?.trim() || null : null;

  // Derive meaningful content presence
  const hasContactInfo = Boolean((contactPerson && contactPerson !== coupleName) || email || phone);
  const hasSocials = Boolean(facebookUrl || instagramUrl || tikTokUrl);
  const hasContactContent = hasContactInfo || hasSocials;
  const showFullFooter = isContactEnabled && hasContactContent;

  // COMPACT FOOTER MODE: When contact_socials is OFF or has zero content
  if (!showFullFooter) {
    return (
      <footer className="wedding-footer pt-6 sm:pt-8 pb-20 sm:pb-24 px-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-4 select-none">
          {/* Centered Identity */}
          <WeddingMonogram
            groomName={data.couple?.groomName}
            brideName={data.couple?.brideName}
            coupleDisplayName={data.coupleDisplayName}
            variant="footer"
          />

          {/* Compact Divider */}
          <div className="w-24 h-px bg-gray-200 my-1 sm:my-2" />

          {/* Legal / Attribution */}
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
                className="text-gray-800 hover:underline font-semibold template-focus-ring"
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

  // FULL FOOTER MODE: When contact_socials is ON and has content
  return (
    <footer className="wedding-footer pt-10 sm:pt-12 pb-24 sm:pb-28 px-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
      <div className="max-w-5xl mx-auto">
        {/* Upper Closing Grid */}
        <div
          className={`grid grid-cols-1 ${
            hasContactInfo && hasSocials ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-8 md:gap-10 items-center text-center ${
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

          {/* Column 2: Connected Contact Channels (When available) */}
          {hasContactInfo && (
            <div
              id="contact_socials"
              className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-700 scroll-mt-20"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Inquiries &amp; Information
              </span>
              {contactPerson && contactPerson !== coupleName && (
                <div className="flex items-center gap-2 text-gray-800 font-semibold text-xs">
                  <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>{contactPerson}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-gray-900 transition-colors font-medium template-focus-ring"
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
                    className="hover:text-gray-900 transition-colors font-medium template-focus-ring"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Column 3: Connected Social Links (When available) */}
          {hasSocials && (
            <div
              id={!hasContactInfo ? "contact_socials" : undefined}
              className={`flex flex-col items-center ${
                hasContactInfo ? "md:items-end" : "md:items-start"
              } gap-2 ${!hasContactInfo ? "scroll-mt-20" : ""}`}
            >
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
        <div className="w-full h-px bg-gray-200 my-6 sm:my-8" />

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
              className="text-gray-800 hover:underline font-semibold template-focus-ring"
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
