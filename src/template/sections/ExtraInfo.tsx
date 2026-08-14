import type { ExtraInfoData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Extra Information & Good to Know details.

export function ExtraInfoSection({ data }: { data: ExtraInfoData }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <section id="extra_info" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Important Details</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.sectionTitle || "Good to Know"}</h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {data.items.map((item) => (
          <div key={item.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-base mb-2">{item.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{item.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
