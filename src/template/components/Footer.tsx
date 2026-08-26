import type { EventTemplateData } from "@/platform/event-template-data";
import { extractMilestoneNumber } from "@/template/utils/host-identity";
import { extractEventYear } from "@/template/utils/event-formatting";
import { Mail, Phone, User } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./ui/BrandIcons";

// DYNAMIC HOST IDENTITY & RESPONSIVE CLOSING SURFACE (SAGE ESTATE COLOPHON)
// Supports both FULL FOOTER MODE (when contact_socials is enabled with content)
// and COMPACT FOOTER MODE (when disabled or empty, preventing empty visual space).

export function Footer({ data }: { data: EventTemplateData }) {
  const eventYear = extractEventYear(data.ceremony?.eventDate || data.eventDate);
  const hostDisplayName = data.coupleDisplayName || "The Celebrant";

  const fullName =
    data.couple?.celebrantName || data.couple?.groomName || data.coupleDisplayName || "Michael";
  const firstName = fullName.trim().split(/\s+/)[0] || "Michael";
  const milestoneNum =
    extractMilestoneNumber(
      data.couple?.milestoneAge ? String(data.couple?.milestoneAge) : undefined
    ) || "10";
  const milestoneText = data.couple?.milestoneAge
    ? String(data.couple?.milestoneAge)
    : `${milestoneNum}th Birthday`;

  const isContactEnabled =
    Boolean(data.enabledSectionKeys?.includes("contact_socials")) && Boolean(data.contact);

  const contactPerson = data.contact?.contactPerson?.trim() || null;
  const email = isContactEnabled ? data.contact?.email?.trim() || null : null;
  const phone = isContactEnabled ? data.contact?.contactNumber?.trim() || null : null;
  const facebookUrl = isContactEnabled ? data.contact?.facebookUrl?.trim() || null : null;
  const instagramUrl = isContactEnabled ? data.contact?.instagramUrl?.trim() || null : null;
  const tikTokUrl = isContactEnabled ? data.contact?.tikTokUrl?.trim() || null : null;

  // Derive meaningful content presence
  const hasContactInfo = Boolean(
    (contactPerson && contactPerson !== hostDisplayName) || email || phone
  );
  const hasSocials = Boolean(facebookUrl || instagramUrl || tikTokUrl);
  const hasContactContent = hasContactInfo || hasSocials;
  const showFullFooter = isContactEnabled && hasContactContent;

  // COMPACT FOOTER MODE: When contact_socials is OFF or has zero content
  if (!showFullFooter) {
    return (
      <footer className="event-footer pattern-glazing-grid pattern-feature pattern-dark pt-10 sm:pt-12 pb-24 sm:pb-28 px-4 bg-[var(--event-surface-dark,#304438)] text-[var(--event-accent-soft,#c7cfbc)] border-t border-[var(--event-surface-dark-alt,#223322)] text-xs">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-4 select-none">
          {/* Centered Identity */}
          <div className="flex items-center gap-2 select-none">
            {/* Primary Wordmark */}
            <span className="font-heading font-black tracking-wider text-white text-sm sm:text-base lg:text-lg uppercase">
              {firstName}
            </span>
            <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">•</span>
            {/* Milestone & Emoji */}
            <span className="font-heading font-bold tracking-wide text-amber-400 text-xs sm:text-sm lg:text-base uppercase">
              <span className="hidden sm:inline">
                {milestoneText || `${milestoneNum}th Birthday`}
              </span>
              <span className="sm:hidden">{milestoneNum}th</span>
            </span>
            <span className="text-sm sm:text-base">🎂</span>
          </div>

          {/* Compact Divider */}
          <div className="w-24 h-px bg-[var(--event-accent,#8f6a2c)]/30 my-1 sm:my-2" />

          {/* Legal / Attribution */}
          <div className="text-center text-xs text-[var(--event-accent-soft,#c7cfbc)]/85 tracking-wider flex flex-col gap-1 font-mono">
            <p>
              &copy; {eventYear} {hostDisplayName}. Celebration Archive Record.
            </p>
            <p className="text-[11px]">
              Custom RSVP by{" "}
              <a
                href="https://rsvp.webserbisyo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--event-on-dark,#f7f4ea)] hover:underline font-semibold template-focus-ring"
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
    <footer className="event-footer pattern-glazing-grid pattern-feature pattern-dark pt-14 sm:pt-16 pb-28 sm:pb-32 px-4 bg-[var(--event-surface-dark,#304438)] text-[var(--event-accent-soft,#c7cfbc)] border-t border-[var(--event-surface-dark-alt,#223322)] text-xs">
      <div className="max-w-5xl mx-auto">
        {/* Upper Closing Grid */}
        <div
          className={`grid grid-cols-1 ${
            hasContactInfo && hasSocials ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-8 sm:gap-12 items-center text-center md:text-left`}
        >
          {/* Column 1: Centered Host Identity */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 select-none">
              {/* Primary Wordmark */}
              <span className="font-heading font-black tracking-wider text-white text-sm sm:text-base lg:text-lg uppercase">
                {firstName}
              </span>
              <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">•</span>
              {/* Milestone & Emoji */}
              <span className="font-heading font-bold tracking-wide text-amber-400 text-xs sm:text-sm lg:text-base uppercase">
                <span className="hidden sm:inline">
                  {milestoneText || `${milestoneNum}th Birthday`}
                </span>
                <span className="sm:hidden">{milestoneNum}th</span>
              </span>
              <span className="text-sm sm:text-base">🎂</span>
            </div>
          </div>

          {/* Column 2: Inquiries / Host Contact (When available) */}
          {hasContactInfo && (
            <div
              id="contact_socials"
              className="flex flex-col items-center md:items-start gap-3 scroll-mt-20"
            >
              <span className="text-role-metadata text-[var(--event-accent,#8f6a2c)] font-mono">
                Celebration Inquiries
              </span>
              {contactPerson && (
                <div className="flex items-center gap-2.5 text-[var(--event-on-dark,#f7f4ea)] text-sm sm:text-base">
                  <User className="w-4 h-4 text-[var(--event-accent,#8f6a2c)] shrink-0" />
                  <span className="font-semibold">{contactPerson}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2.5 text-sm sm:text-base">
                  <Mail className="w-4 h-4 text-[var(--event-accent,#8f6a2c)] shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[var(--event-on-dark,#f7f4ea)] transition-colors font-medium template-focus-ring text-[var(--event-accent-soft,#c7cfbc)]"
                  >
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2.5 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-[var(--event-accent,#8f6a2c)] shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-[var(--event-on-dark,#f7f4ea)] transition-colors font-medium template-focus-ring text-[var(--event-accent-soft,#c7cfbc)]"
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
              <span className="text-role-metadata text-[var(--event-accent,#8f6a2c)] font-mono">
                Social Channels
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ key, url, label, Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[var(--event-surface-dark-alt,#223322)] rounded-full border border-[var(--event-accent,#8f6a2c)]/40 text-[var(--event-accent-soft,#c7cfbc)] hover:text-white hover:scale-105 transition-all shadow-xs template-focus-ring"
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
        <div className="w-full h-px bg-[var(--event-accent,#8f6a2c)]/20 my-6 sm:my-8" />

        <div className="text-center text-xs text-[var(--event-accent-soft,#c7cfbc)]/85 tracking-wider flex flex-col gap-1 font-mono">
          <p>
            &copy; {eventYear} {hostDisplayName}. Celebration Archive Record. All rights reserved.
          </p>
          <p className="text-[11px]">
            Custom RSVP by{" "}
            <a
              href="https://rsvp.webserbisyo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--event-on-dark,#f7f4ea)] hover:underline font-semibold template-focus-ring"
            >
              WebSerbisyo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
