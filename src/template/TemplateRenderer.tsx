"use client";

import type { WeddingTemplateData } from "@/platform/wedding-template-data";
import { templateSectionRegistry } from "./section-registry";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { QuickDock } from "./components/QuickDock";
import { AudioProvider, FloatingMusicBubble } from "./components/AudioPlayer";
import { buildWeddingNavigation } from "./navigation/wedding-navigation";

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
  const navModel = buildWeddingNavigation(data);

  return (
    <AudioProvider
      initialMusicLink={data.music?.musicLink}
      initialMusicTitle={data.music?.musicTitle}
      initialShortNote={data.music?.shortNote}
    >
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

        {/* Floating Shell Layer */}
        <QuickDock items={navModel.dockItems} />
        <FloatingMusicBubble />
      </div>
    </AudioProvider>
  );
}
