"use client";

import React from "react";
import type { EventTemplateData } from "@/platform/event-template-data";
import { templateSectionRegistry } from "./section-registry";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingControls } from "./components/FloatingControls";
import { AudioProvider } from "./components/AudioPlayer";
import { buildEventNavigation } from "./navigation/event-navigation";

import { ElectricDivider } from "./components/ui/ElectricDivider";

export type TemplateRendererProps = {
  data: EventTemplateData;
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
  const navModel = buildEventNavigation(data);

  return (
    <AudioProvider
      initialMusicLink={data.music?.musicLink}
      initialMusicTitle={data.music?.musicTitle}
      initialShortNote={data.music?.shortNote}
    >
      <div className="min-h-screen flex flex-col bg-[var(--event-bg)] text-[var(--event-text-main)] font-sans antialiased selection:bg-red-500 selection:text-white">
        <Navbar data={data} />

        <main className="flex-1 pt-16">
          {data.orderedSectionKeys
            .filter((key) => key !== "contact_socials")
            .map((key, idx, arr) => {
              const renderSection = templateSectionRegistry[key];
              if (!renderSection) return null;

              const isLast = idx === arr.length - 1;
              const dividerColor = idx % 2 === 0 ? "#00f0ff" : "#f59e0b";

              return (
                <React.Fragment key={key}>
                  <div>
                    {renderSection({
                      data,
                      apiBaseUrl,
                      accessToken,
                      isDemoMode,
                    })}
                  </div>
                  {!isLast && (
                    <ElectricDivider
                      color={dividerColor}
                      chaos={0.16}
                      thickness={2}
                      className="-my-3 sm:-my-4 relative z-30 pointer-events-none"
                    />
                  )}
                </React.Fragment>
              );
            })}
        </main>

        <Footer data={data} />

        {/* Unified Floating Controls Cluster */}
        <FloatingControls items={navModel.dockItems} />
      </div>
    </AudioProvider>
  );
}
