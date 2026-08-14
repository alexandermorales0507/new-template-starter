"use client";

import { useState } from "react";
import type { MusicData } from "@/platform/wedding-template-data";
import { Music, Volume2, VolumeX } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Music & Audio effects player widget.

export function MusicSection({ data }: { data: MusicData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const track = data.musicTitle || "Background Music";
  const link = data.musicLink;
  const playLabel = data.playButtonLabel || "Play music";

  if (!link && !data.musicTitle) return null;

  return (
    <div id="music_effects" className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md rounded-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700">
        <Music className="w-4 h-4 text-gray-600" />
        <span className="font-medium max-w-[160px] truncate" title={track}>
          {track}
        </span>
        {link && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label={isPlaying ? "Mute music" : playLabel}
            title={isPlaying ? "Mute music" : playLabel}
          >
            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
