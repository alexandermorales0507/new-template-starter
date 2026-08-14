import type { GuestbookData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Guestbook messages section.

export function GuestbookSection({ data }: { data: GuestbookData }) {
  const messages = data.messages || [];

  return (
    <section id="guestbook" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Wishes</p>
        <h2 className="text-3xl font-bold text-gray-900">
          {data.sectionTitle || "Wishes & Blessings"}
        </h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>

      {messages.length > 0 ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-sm shadow-xs"
            >
              <p className="text-gray-800 italic mb-3 leading-relaxed">&ldquo;{msg.message}&rdquo;</p>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-700">{msg.guestName || "Guest"}</span>
                {msg.submittedAt && (
                  <span>{new Date(msg.submittedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center max-w-md mx-auto">
          <p className="text-sm text-gray-500">
            {data.emptyStateMessage || "No approved messages yet. Check back soon!"}
          </p>
        </div>
      )}
    </section>
  );
}
