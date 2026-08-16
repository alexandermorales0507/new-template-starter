import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { WeddingMonogram } from "./WeddingMonogram";
import { extractEventYear } from "@/template/utils/event-formatting";
import { Mail, Phone, User } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./ui/BrandIcons";

// DYNAMIC COUPLE IDENTITY & RESPONSIVE CLOSING SURFACE (SAGE ESTATE COLOPHON)
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
      <footer className="wedding-footer pattern-glazing-grid pattern-feature pattern-dark pt-10 sm:pt-12 pb-24 sm:pb-28 px-4 bg-[var(--wedding-surface-dark)] text-[var(--wedding-accent-soft)] border-t border-[var(--wedding-surface-dark-alt)] text-xs">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-4 select-none">
          {/* Centered Identity */}
          <WeddingMonogram
            groomName={data.couple?.groomName}
            brideName={data.couple?.brideName}
            coupleDisplayName={data.coupleDisplayName}
            variant="footer"
          />

          {/* Compact Divider */}
          <div className="w-24 h-px bg-[var(--wedding-accent)]/30 my-1 sm:my-2" />

          {/* Legal / Attribution */}
          <div className="text-center text-xs text-[var(--wedding-accent-soft)]/85 tracking-wider flex flex-col gap-1 font-mono">
            <p>
              &copy; {eventYear} {coupleName}. Estate Archive Record.
            </p>
            <p className="text-[11px]">
              Custom RSVP by{" "}
              <a
                href="https://rsvp.webserbisyo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--wedding-on-dark)] hover:underline font-semibold template-focus-ring"
              >
                WebSerbisyo
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  const socialLinks = [
    { key: "facebook", url: facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { key: "instagram", url: instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { key: "tiktok", url: tikTokUrl, label: "TikTok", Icon: TikTokIcon },
  ].filter((item): item is typeof item & { url: string } => Boolean(item.url && item.url.trim()));

  // FULL FOOTER MODE: When contact_socials is ON and has content
  return (
    <footer className="wedding-footer pattern-glazing-grid pattern-feature pattern-dark pt-14 sm:pt-16 pb-28 sm:pb-32 px-4 bg-[var(--wedding-surface-dark)] text-[var(--wedding-accent-soft)] border-t border-[var(--wedding-surface-dark-alt)] text-xs">
      <div className="max-w-5xl mx-auto">
        {/* Upper Closing Grid */}
        <div
          className={`grid grid-cols-1 ${
            hasContactInfo && hasSocials ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-8 sm:gap-12 items-center text-center md:text-left`}
        >
          {/* Column 1: Centered Couple Identity */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <WeddingMonogram
              groomName={data.couple?.groomName}
              brideName={data.couple?.brideName}
              coupleDisplayName={data.coupleDisplayName}
              variant="footer"
            />
          </div>

          {/* Column 2: Inquiries / Host Contact (When available) */}
          {hasContactInfo && (
            <div
              id="contact_socials"
              className="flex flex-col items-center md:items-start gap-3 scroll-mt-20"
            >
              <span className="text-role-metadata text-[var(--wedding-accent)] font-mono">
                Celebration Inquiries
              </span>
              {contactPerson && (
                <div className="flex items-center gap-2.5 text-[var(--wedding-on-dark)] text-sm sm:text-base">
                  <User className="w-4 h-4 text-[var(--wedding-accent)] shrink-0" />
                  <span className="font-semibold">{contactPerson}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2.5 text-sm sm:text-base">
                  <Mail className="w-4 h-4 text-[var(--wedding-accent)] shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[var(--wedding-on-dark)] transition-colors font-medium template-focus-ring text-[var(--wedding-accent-soft)]"
                  >
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2.5 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-[var(--wedding-accent)] shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-[var(--wedding-on-dark)] transition-colors font-medium template-focus-ring text-[var(--wedding-accent-soft)]"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Column 3: Connected Social Links (When available) */}
          {hasSocials && socialLinks.length > 0 && (
            <div
              id={!hasContactInfo ? "contact_socials" : undefined}
              className={`flex flex-col items-center ${
                hasContactInfo ? "md:items-end" : "md:items-start"
              } gap-3 ${!hasContactInfo ? "scroll-mt-20" : ""}`}
            >
              <span className="text-role-metadata text-[var(--wedding-accent)] font-mono">
                Social Channels
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ key, url, label, Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[var(--wedding-surface-dark-alt)] rounded-full border border-[var(--wedding-accent)]/40 text-[var(--wedding-accent-soft)] hover:text-white hover:scale-105 transition-all shadow-xs template-focus-ring"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Strip */}
        <div className="w-full h-px bg-[var(--wedding-accent)]/20 my-6 sm:my-8" />

        <div className="text-center text-xs text-[var(--wedding-accent-soft)]/85 tracking-wider flex flex-col gap-1 font-mono">
          <p>
            &copy; {eventYear} {coupleName}. Estate Archive Record. All rights reserved.
          </p>
          <p className="text-[11px]">
            Custom RSVP by{" "}
            <a
              href="https://rsvp.webserbisyo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--wedding-on-dark)] hover:underline font-semibold template-focus-ring"
            >
              WebSerbisyo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
