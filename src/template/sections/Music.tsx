"use client";

import { useEffect } from "react";
import type { MusicData } from "@/platform/event-template-data";
import { useAudio } from "@/template/components/AudioPlayer";
import { Reveal } from "@/template/components/motion/Reveal";
import { parseMusicMeta } from "@/template/utils/music-meta";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, Square, Music4 } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// Controls playback through the shared template audio context with animated vinyl disc.

export function MusicSection({ data }: { data: MusicData }) {
  const shouldReduceMotion = useReducedMotion();
  const { playbackState, isPlaying, play, pause, stop, setMusicData } = useAudio();

  const link = data.musicLink;
  const playLabel = data.playButtonLabel || "Play Song";
  const note = data.shortNote;

  useEffect(() => {
    if (link) {
      setMusicData(link, data.musicTitle, data.shortNote);
    }
  }, [link, data.musicTitle, data.shortNote, setMusicData]);

  if (!link && !data.musicTitle) return null;

  const { displayTitle, displayArtist } = parseMusicMeta(data.musicTitle);

  return (
    <section
      id="music_effects"
      className="template-section template-section-compact text-center relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)] !pt-20 md:!pt-24"
    >
      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="mb-6 space-y-2">
            <span className="text-role-subheading text-[var(--event-accent,#f59e0b)]">
              CELEBRATION SOUNDTRACK
            </span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)]">Theme Song</h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div
            data-surface="light"
            className="surface-light-reset bg-[var(--event-surface)] p-6 sm:p-8 rounded-2xl border-2 border-[var(--event-border)] max-w-md mx-auto shadow-[var(--event-shadow-paper-md)] relative overflow-visible text-[var(--event-text-main)]"
          >
            {/* Spinning Vinyl Disc with Beamed-Note Center */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center z-10">
              {/* Pulsating outer light ring */}
              {isPlaying && !shouldReduceMotion && (
                <div className="absolute inset-0 rounded-full border border-[var(--event-primary)] scale-110 animate-ping pointer-events-none" />
              )}

              {/* Spinning vinyl disc */}
              <motion.div
                animate={{ rotate: !shouldReduceMotion && isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-[var(--event-border)] shadow-xl flex items-center justify-center relative group"
              >
                {/* Concentric record grooves */}
                <div className="absolute inset-2 rounded-full border border-slate-700/50 pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-slate-700/50 pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-slate-700/50 pointer-events-none" />

                {/* Center label with Music4 beamed note */}
                <div className="w-10 h-10 rounded-full bg-[var(--event-accent)] flex items-center justify-center shadow-inner">
                  <Music4 className="w-4 h-4 text-slate-900" aria-hidden="true" />
                </div>
              </motion.div>
            </div>

            {/* Connected Song Title */}
            <h3
              className="font-serif font-bold text-[var(--event-text-main)] text-2xl sm:text-3xl mb-1 truncate"
              title={displayTitle}
            >
              {displayTitle}
            </h3>

            {displayArtist && (
              <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[var(--event-primary)] mb-4">
                {displayArtist}
              </p>
            )}

            {note && (
              <p className="text-sm text-[var(--event-text-muted)] italic max-w-xs mx-auto mb-6 leading-relaxed font-sans">
                &ldquo;{note}&rdquo;
              </p>
            )}

            {link && (
              <div className="flex justify-center items-center gap-3 pt-2 font-sans">
                {isPlaying ? (
                  <button
                    type="button"
                    onClick={pause}
                    className="py-3 px-6 bg-[var(--event-primary)] hover:bg-[var(--event-primary-hover)] text-[var(--event-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-[var(--event-shadow-paper-sm)] flex items-center gap-2 template-focus-ring cursor-pointer min-h-[44px]"
                    aria-label="Pause song"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={play}
                    className="py-3 px-6 bg-[var(--event-primary)] hover:bg-[var(--event-primary-hover)] text-[var(--event-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-[var(--event-shadow-paper-sm)] flex items-center gap-2 template-focus-ring cursor-pointer min-h-[44px]"
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
                    className="py-3 px-5 bg-[var(--event-surface-alt)] hover:bg-[var(--event-border-subtle)] text-[var(--event-text-main)] text-sm font-medium rounded-xl transition-colors flex items-center gap-2 template-focus-ring cursor-pointer border border-[var(--event-border)] min-h-[44px]"
                    aria-label="Stop song"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
