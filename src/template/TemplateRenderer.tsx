import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { templateSectionRegistry } from "./section-registry";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export type TemplateRendererProps = {
  data: WeddingTemplateData;
  apiBaseUrl?: string;
  accessToken?: string | null;
  isDemoMode?: boolean;
};

export function TemplateRenderer({
  data,
  apiBaseUrl,
  accessToken,
  isDemoMode,
}: TemplateRendererProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-gray-200">
      <Navbar data={data} />

      <main className="flex-1">
        {data.orderedSectionKeys.map((key) => {
          const renderSection = templateSectionRegistry[key];
          if (!renderSection) return null;

          return (
            <div key={key}>
              {renderSection({
                data,
                apiBaseUrl,
                accessToken,
                isDemoMode,
              })}
            </div>
          );
        })}
      </main>

      <Footer data={data} />
    </div>
  );
}
