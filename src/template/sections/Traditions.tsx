import type { TraditionsData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Traditions (Eighteen Roses & Candles / Traditional customs) section.

export function TraditionsSection({ data }: { data: TraditionsData }) {
  if (!data.groups || data.groups.length === 0) return null;

  return (
    <section
      id="eighteen_roses_candles"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
          Customs &amp; Traditions
        </p>
        <h2 className="text-3xl font-bold text-gray-900">Traditions &amp; Honors</h2>
      </div>
      <div className="space-y-6 max-w-2xl mx-auto">
        {data.groups.map((group) => (
          <div key={group.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-base mb-4 border-b border-gray-200 pb-2 text-center uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="space-y-2 text-sm">
              {group.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center py-1 border-b border-gray-100 last:border-none"
                >
                  <span className="font-semibold text-gray-900">{entry.name}</span>
                  {entry.message && <span className="text-gray-600 italic text-xs">{entry.message}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
