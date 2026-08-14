import type { GalleryData } from "@/platform/wedding-template-data";
import { templateAssets } from "@/template/template-assets";

// PLATFORM DATA — KEEP DYNAMIC.
// Gallery section metadata comes from platform. Photos are managed as local template assets.

export function GallerySection({ data }: { data: GalleryData }) {
  const localPhotos = templateAssets.photos.gallery || [];

  return (
    <section
      id="gallery"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200 text-center"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Photos</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.sectionTitle || "Gallery"}</h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>

      {localPhotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {localPhotos.map((photoUrl, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg border border-gray-200 shadow-xs">
              <img
                src={photoUrl}
                alt={`Gallery photo ${idx + 1}`}
                className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 max-w-xl mx-auto">
          <p className="text-xs text-gray-500">Official photos will appear here.</p>
        </div>
      )}
    </section>
  );
}
