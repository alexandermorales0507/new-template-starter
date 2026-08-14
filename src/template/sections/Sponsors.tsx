import type { SponsorsData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Principal Sponsors section.
// Renders responsive witness list in canonical order without inventing pairs.

function parseSponsorNames(rawNames: string): string[] {
  if (!rawNames || typeof rawNames !== "string") return [];

  const lines = rawNames
    .split(/\r?\n/)
    .map((n) => n.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  if (lines.length === 1 && lines[0].includes(",")) {
    return lines[0]
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
  }

  return lines;
}

export function SponsorsSection({ data }: { data: SponsorsData }) {
  const namesList = parseSponsorNames(data.names || "");

  if (namesList.length === 0) return null;

  return (
    <section
      id="principal_sponsors"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Witnesses</p>
        <h2 className="text-3xl font-bold text-gray-900">Principal Sponsors</h2>
        {data.introLine && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
            {data.introLine}
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 max-w-2xl mx-auto shadow-xs">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-gray-800 text-center sm:text-left">
          {namesList.map((sponsor, idx) => (
            <li
              key={idx}
              className="py-1 px-2 border-b border-gray-100 last:border-none sm:last:border-b"
            >
              {sponsor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
