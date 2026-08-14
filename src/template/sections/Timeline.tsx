import type { TimelineData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Program & Timeline schedule.

export function TimelineSection({ data }: { data: TimelineData }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <section
      id="timeline_program"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Schedule</p>
        <h2 className="text-3xl font-bold text-gray-900">
          {data.sectionTitle || "Program & Timeline"}
        </h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        {data.items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="w-24 shrink-0 text-right font-semibold text-gray-800 text-sm py-1">
              {item.time}
            </div>
            <div className="relative pl-6 border-l-2 border-gray-300 pb-2">
              <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-white" />
              <h3 className="font-medium text-gray-900 text-base">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
