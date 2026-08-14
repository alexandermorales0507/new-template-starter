import type { EntourageData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Entourage wedding party members.

export function EntourageSection({ data }: { data: EntourageData }) {
  if (!data.groups || data.groups.length === 0) return null;

  return (
    <section id="entourage" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Wedding Party</p>
        <h2 className="text-3xl font-bold text-gray-900">The Entourage</h2>
        {data.introLine && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">{data.introLine}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {data.groups.map((group) => {
          const namesList = group.names
            .split("\n")
            .map((n) => n.trim())
            .filter(Boolean);

          return (
            <div key={group.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2 uppercase tracking-wide">
                {group.groupTitle}
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {namesList.map((member, mIdx) => (
                  <li key={mIdx}>{member}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
