import type { ContactData } from "@/platform/event-template-data";
import { Phone, Mail, User } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "../components/ui/BrandIcons";

// PLATFORM DATA — KEEP DYNAMIC.
// Contact & Socials section.

export function ContactSection({ data }: { data?: ContactData | null }) {
  if (!data) return null;

  const hasContent = Boolean(
    data.contactPerson?.trim() ||
    data.contactNumber?.trim() ||
    data.email?.trim() ||
    data.facebookUrl?.trim() ||
    data.instagramUrl?.trim() ||
    data.tikTokUrl?.trim()
  );

  if (!hasContent) return null;

  return (
    <section
      id="contact_socials"
      className="template-section bg-pattern-heroic-02 relative overflow-x-clip bg-[var(--event-bg,#0f172a)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container relative z-10">
        <div className="text-center mb-8 space-y-2">
          <span className="comic-badge comic-badge-gold">HQ COMMS // GET IN TOUCH</span>
          <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
            Contact &amp; Socials
          </h2>
        </div>
        <div className="bg-[var(--event-surface)] p-6 rounded-2xl border border-[var(--event-border)] max-w-xl mx-auto space-y-4 text-sm shadow-xs">
          {data.contactPerson && (
            <div className="flex items-center gap-3 text-[var(--event-text)]">
              <User className="w-4 h-4 text-[var(--event-accent)] shrink-0" />
              <span className="font-semibold">{data.contactPerson}</span>
            </div>
          )}
          {data.contactNumber && (
            <div className="flex items-center gap-3 text-[var(--event-text)]">
              <Phone className="w-4 h-4 text-[var(--event-accent)] shrink-0" />
              <span>{data.contactNumber}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-3 text-[var(--event-text)]">
              <Mail className="w-4 h-4 text-[var(--event-accent)] shrink-0" />
              <a
                href={`mailto:${data.email}`}
                className="text-[var(--event-primary)] hover:underline font-medium template-focus-ring"
              >
                {data.email}
              </a>
            </div>
          )}
          {(data.facebookUrl || data.instagramUrl || data.tikTokUrl) && (
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[var(--event-border-subtle)] text-xs">
              {data.facebookUrl && (
                <a
                  href={data.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--event-primary)] hover:underline flex items-center gap-1 font-medium template-focus-ring"
                >
                  <FacebookIcon className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              {data.instagramUrl && (
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--event-primary)] hover:underline flex items-center gap-1 font-medium template-focus-ring"
                >
                  <InstagramIcon className="w-3.5 h-3.5" /> Instagram
                </a>
              )}
              {data.tikTokUrl && (
                <a
                  href={data.tikTokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--event-primary)] hover:underline flex items-center gap-1 font-medium template-focus-ring"
                >
                  <TikTokIcon className="w-3.5 h-3.5" /> TikTok
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
