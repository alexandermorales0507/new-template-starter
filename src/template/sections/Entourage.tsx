import type { EntourageData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Entourage wedding party members.
// Renders responsive group cards with vertical name lists.
// Parses names line-by-line safely without corrupting name suffixes.

function parseEntourageNames(rawNames: string): string[] {
  if (!rawNames || typeof rawNames !== "string") return [];

  const lines = rawNames
    .split(/\r?\n/)
    .map((n) => n.trim())
    .filter(Boolean);

  // If multiple lines are provided, each line is an entourage member
  if (lines.length > 1) {
    return lines;
  }

  // If a single line contains comma-separated names, split by comma safely
  if (lines.length === 1 && lines[0].includes(",")) {
    return lines[0]
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
  }

  return lines;
}

export function EntourageSection({ data }: { data: EntourageData }) {
  if (!data.groups || data.groups.length === 0) return null;

  // Filter out any completely empty groups
  const validGroups = data.groups.filter((g) => {
    const title = (g.groupTitle || "").trim();
    const names = parseEntourageNames(g.names);
    return title.length > 0 || names.length > 0;
  });

  if (validGroups.length === 0) return null;

  return (
    <section
      id="entourage"
      className="template-section py-12 px-4 max-w-5xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Wedding Party</p>
        <h2 className="text-3xl font-bold text-gray-900">The Entourage</h2>
        {data.introLine && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
            {data.introLine}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {validGroups.map((group) => {
          const namesList = parseEntourageNames(group.names);

          return (
            <div
              key={group.id}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center shadow-xs flex flex-col justify-start"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2.5 uppercase tracking-wider">
                {group.groupTitle || "Wedding Party"}
              </h3>

              <ul className="space-y-1.5 text-sm text-gray-700">
                {namesList.map((member, mIdx) => (
                  <li key={mIdx} className="leading-snug">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
