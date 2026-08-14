import type { ContactData } from "@/platform/wedding-template-data";
import { Phone, Mail, Globe, User } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Contact & Socials section.

export function ContactSection({ data }: { data: ContactData }) {
  const hasContent = Boolean(
    data.contactPerson ||
    data.contactNumber ||
    data.email ||
    data.facebookUrl ||
    data.instagramUrl ||
    data.tikTokUrl
  );

  if (!hasContent) return null;

  return (
    <section
      id="contact_socials"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Get in Touch</p>
        <h2 className="text-3xl font-bold text-gray-900">Contact &amp; Socials</h2>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-xl mx-auto space-y-4 text-sm">
        {data.contactPerson && (
          <div className="flex items-center gap-3 text-gray-700">
            <User className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="font-semibold">{data.contactPerson}</span>
          </div>
        )}
        {data.contactNumber && (
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-4 h-4 text-gray-500 shrink-0" />
            <span>{data.contactNumber}</span>
          </div>
        )}
        {data.email && (
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-4 h-4 text-gray-500 shrink-0" />
            <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
              {data.email}
            </a>
          </div>
        )}
        {(data.facebookUrl || data.instagramUrl || data.tikTokUrl) && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-200 text-xs">
            {data.facebookUrl && (
              <a
                href={data.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" /> Facebook
              </a>
            )}
            {data.instagramUrl && (
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" /> Instagram
              </a>
            )}
            {data.tikTokUrl && (
              <a
                href={data.tikTokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" /> TikTok
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
