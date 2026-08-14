import type { LoveStoryData } from "@/platform/wedding-template-data";
import { templateAssets } from "@/template/template-assets";

// PLATFORM DATA — KEEP DYNAMIC.
// Love Story / Narrative section. Visual photo is managed as a local template asset.

export function LoveStorySection({ data }: { data: LoveStoryData }) {
  if (!data.storyBody && !data.storyTitle) return null;
  const storyPhotos = templateAssets.photos.story || [];

  return (
    <section id="story_message" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Our Journey</p>
        <h2 className="text-3xl font-bold text-gray-900">{data.storyTitle || "Love Story"}</h2>
        {data.sectionIntro && (
          <p className="text-sm text-gray-600 max-w-xl mx-auto mt-2">{data.sectionIntro}</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {storyPhotos.length > 0 && (
          <div className="mb-6">
            <img
              src={storyPhotos[0]}
              alt="Our Story"
              className="w-full h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        )}
        {data.storyBody && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <p className="text-base text-gray-700 leading-relaxed italic">
              &ldquo;{data.storyBody}&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
