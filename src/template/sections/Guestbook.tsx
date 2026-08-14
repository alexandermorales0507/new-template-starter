import type { GuestbookData } from "@/platform/wedding-template-data";
import { formatGuestbookDate } from "@/template/utils/event-formatting";

// PLATFORM DATA — KEEP DYNAMIC.
// Guestbook messages section.
// Displays approved guest messages from platform DTO.
// Fails gracefully for 0, 1, 2, 3, or many messages.

export function GuestbookSection({ data }: { data: GuestbookData }) {
  const messages = data.messages || [];

  return (
    <section
      id="guestbook"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Wishes</p>
        <h2 className="text-3xl font-bold text-gray-900">
          {data.sectionTitle || "Wishes & Blessings"}
        </h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
            {data.sectionIntro}
          </p>
        )}
      </div>

      {messages.length > 0 ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg, idx) => {
            const formattedDate = formatGuestbookDate(msg.submittedAt || msg.approvedAt);

            return (
              <div
                key={msg.id || idx}
                className="bg-gray-50 p-5 md:p-6 rounded-xl border border-gray-200 text-sm shadow-xs transition-shadow hover:shadow-sm"
              >
                <p className="text-gray-800 italic mb-4 leading-relaxed text-base">
                  &ldquo;{msg.message}&rdquo;
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900 text-sm">
                    {msg.guestName || "Guest"}
                  </span>
                  {formattedDate && <span>{formattedDate}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center max-w-md mx-auto shadow-xs">
          <p className="text-sm text-gray-600 leading-relaxed">
            {data.emptyStateMessage || "Approved guest messages will appear here soon."}
          </p>
        </div>
      )}
    </section>
  );
}
