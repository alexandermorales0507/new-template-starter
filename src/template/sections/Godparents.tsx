import type { GodparentsData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Godparents blessing members section.

export function GodparentsSection({ data }: { data: GodparentsData }) {
  if (!data.groups || data.groups.length === 0) return null;

  return (
    <section id="godparents" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Blessings</p>
        <h2 className="text-3xl font-bold text-gray-900">Godparents</h2>
      </div>
      <div className="space-y-6 max-w-2xl mx-auto">
        {data.groups.map((group) => (
          <div key={group.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-base mb-3 border-b border-gray-200 pb-2 text-center uppercase tracking-wide">
              {group.title}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800 text-center">
              {group.names.map((gp) => (
                <li key={gp.id} className="bg-white p-2 rounded border border-gray-200 text-center">
                  {gp.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
