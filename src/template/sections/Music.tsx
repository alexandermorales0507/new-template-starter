"use client";

import { useEffect } from "react";
import type { MusicData } from "@/platform/wedding-template-data";
import { useAudio } from "@/template/components/AudioPlayer";
import { Music, Play, Pause, Square } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Music & Audio effects section.
// Renders as a full in-page section within normal document flow.
// Controls playback through the shared template audio context.

export function MusicSection({ data }: { data: MusicData }) {
  const { playbackState, isPlaying, play, pause, stop, setMusicData } = useAudio();

  const title = data.musicTitle || "Our Wedding Song";
  const link = data.musicLink;
  const playLabel = data.playButtonLabel || "Play Song";
  const note = data.shortNote;

  useEffect(() => {
    if (link) {
      setMusicData(link, data.musicTitle, data.shortNote);
    }
  }, [link, data.musicTitle, data.shortNote, setMusicData]);

  if (!link && !data.musicTitle) return null;

  return (
    <section
      id="music_effects"
      className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200 text-center"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Ambiance</p>
        <h2 className="text-3xl font-bold text-gray-900">Our Wedding Song</h2>
      </div>

      <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 max-w-md mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-gray-900 text-white mx-auto mb-4 flex items-center justify-center shadow-md">
          <Music className={`w-8 h-8 ${isPlaying ? "animate-pulse" : ""}`} />
        </div>

        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate" title={title}>
          {title}
        </h3>

        {note && (
          <p className="text-xs md:text-sm text-gray-600 italic max-w-xs mx-auto mb-6 leading-relaxed">
            &ldquo;{note}&rdquo;
          </p>
        )}

        {link && (
          <div className="flex justify-center items-center gap-3">
            {isPlaying ? (
              <button
                type="button"
                onClick={pause}
                className="py-2.5 px-5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 template-focus-ring cursor-pointer"
                aria-label="Pause song"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={play}
                className="py-2.5 px-5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 template-focus-ring cursor-pointer"
                aria-label={playbackState === "paused" ? "Resume song" : playLabel}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{playbackState === "paused" ? "Resume" : playLabel}</span>
              </button>
            )}

            {(playbackState === "playing" || playbackState === "paused") && (
              <button
                type="button"
                onClick={stop}
                className="py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 template-focus-ring cursor-pointer"
                aria-label="Stop song"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
