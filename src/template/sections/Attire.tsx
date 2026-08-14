import type { AttireData } from "@/platform/wedding-template-data";
import { templateConfig } from "@/template/template.config";

// PLATFORM DATA — KEEP DYNAMIC.
// Attire & Motif details. Color palette swatches come from template-local configuration.

export function AttireSection({ data }: { data: AttireData }) {
  const localPalette = templateConfig.palette || [];

  return (
    <section
      id="attire_motif"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Dress Code</p>
        <h2 className="text-3xl font-bold text-gray-900">Attire & Motif</h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto text-center space-y-4">
        {data.dressCodeNote && (
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{data.dressCodeNote}</p>
        )}

        {localPalette.length > 0 && (
          <div className="pt-2">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Palette Inspiration
            </p>
            <div className="flex justify-center items-center gap-3">
              {localPalette.map((swatch, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300 shadow-xs"
                    style={{ backgroundColor: swatch.hex }}
                    title={`${swatch.name} (${swatch.hex})`}
                  />
                  <span className="text-[10px] text-gray-500 font-medium">{swatch.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.colorMotifNote && (
          <p className="text-xs text-gray-600 italic pt-2 border-t border-gray-200">
            {data.colorMotifNote}
          </p>
        )}
      </div>
    </section>
  );
}
