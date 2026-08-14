import type { GiftsData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Gift Details & Monetary Gift options (Max 2 options).

export function GiftsSection({ data }: { data: GiftsData }) {
  const options = (data.options || []).slice(0, 2);

  if (!data.giftNote && !data.sectionIntro && options.length === 0) return null;

  return (
    <section
      id="gift_details"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Registry</p>
        <h2 className="text-3xl font-bold text-gray-900">Gift Details</h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-xl mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto space-y-6">
        {data.giftNote && (
          <p className="text-sm text-gray-700 leading-relaxed text-center italic">
            {data.giftNote}
          </p>
        )}

        {options.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 text-xs mb-4 uppercase tracking-wider text-center text-gray-500">
              Gift Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 text-center text-sm shadow-xs"
                >
                  <span className="font-bold text-gray-900 block text-base mb-1">{opt.title}</span>
                  {opt.image?.url && (
                    <div className="mt-3">
                      <img
                        src={opt.image.url}
                        alt={opt.image.alt || `${opt.title} QR`}
                        className="w-32 h-32 object-contain mx-auto border border-gray-200 rounded p-1 bg-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
