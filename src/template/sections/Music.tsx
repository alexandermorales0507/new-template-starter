"use client";

import { useEffect } from "react";
import type { MusicData } from "@/platform/wedding-template-data";
import { sageDecorations } from "@/template/template-assets";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { DecorativePattern } from "@/template/components/decorations/DecorativePattern";
import { useAudio } from "@/template/components/AudioPlayer";
import { Reveal } from "@/template/components/motion/Reveal";
import { parseMusicMeta } from "@/template/utils/music-meta";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, Square, Music4 } from "lucide-react";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE CELEBRATION SOUNDTRACK
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
      className="template-section section-surface-primary template-section-compact text-center relative overflow-x-clip"
    >
      {/* Decorative Glasshouse Grid Pattern Background (Subtle Champagne Texture on Forest Canvas) */}
      <DecorativePattern
        src={sageDecorations.glasshouseGridPattern}
        opacity={0.22}
        objectPosition="center center"
        blendMode="soft-light"
      />

      <div className="template-container-narrow relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="mb-6 space-y-2">
            <span className="text-role-subheading text-[var(--wedding-accent-soft)]">
              CELEBRATION SOUNDTRACK
            </span>
            <h2 className="text-role-heading text-[var(--wedding-on-primary)]">Our Wedding Song</h2>
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div
            data-surface="light"
            className="surface-light-reset bg-[var(--wedding-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--wedding-border)] max-w-md mx-auto shadow-card relative overflow-visible text-[var(--wedding-text)]"
          >
            {/* Botanical Corner Pair on White Music Panel */}
            <BotanicalCornerPair size="md" />

            {/* Spinning Vinyl Disc with Beamed-Note Center */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center z-10">
              {/* Pulsating outer light ring */}
              {isPlaying && !shouldReduceMotion && (
                <div className="absolute inset-0 rounded-full border border-[var(--wedding-accent)]/40 scale-110 animate-ping pointer-events-none" />
              )}

              {/* Spinning vinyl disc */}
              <motion.div
                animate={{ rotate: !shouldReduceMotion && isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="w-full h-full rounded-full bg-gradient-to-br from-[var(--wedding-surface-dark)] via-[#15231c] to-[var(--wedding-surface-dark)] border-2 border-[var(--wedding-accent)]/30 shadow-xl flex items-center justify-center relative group"
              >
                {/* Concentric record grooves */}
                <div className="absolute inset-2 rounded-full border border-[var(--wedding-accent)]/15 pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-[var(--wedding-accent)]/15 pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-[var(--wedding-accent)]/15 pointer-events-none" />

                {/* Center label with Music4 beamed note */}
                <div className="w-10 h-10 rounded-full bg-[var(--wedding-accent-soft)] flex items-center justify-center shadow-inner">
                  <Music4
                    className="w-4 h-4 text-[var(--wedding-surface-dark)]"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            </div>

            {/* Connected Song Title with Guaranteed Dark Forest Contrast */}
            <h3
              className="font-serif font-bold text-[var(--wedding-text)] text-2xl sm:text-3xl mb-1 truncate"
              title={displayTitle}
            >
              {displayTitle}
            </h3>

            {displayArtist && (
              <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[var(--wedding-accent)] mb-4">
                {displayArtist}
              </p>
            )}

            {note && (
              <p className="text-sm text-[var(--wedding-text-muted)] italic max-w-xs mx-auto mb-6 leading-relaxed font-serif">
                &ldquo;{note}&rdquo;
              </p>
            )}

            {link && (
              <div className="flex justify-center items-center gap-3 pt-2 font-sans">
                {isPlaying ? (
                  <button
                    type="button"
                    onClick={pause}
                    className="py-3 px-6 bg-[var(--wedding-primary)] hover:bg-[var(--wedding-primary-hover)] text-[var(--wedding-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 template-focus-ring cursor-pointer min-h-[44px]"
                    aria-label="Pause song"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={play}
                    className="py-3 px-6 bg-[var(--wedding-primary)] hover:bg-[var(--wedding-primary-hover)] text-[var(--wedding-on-primary)] text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 template-focus-ring cursor-pointer min-h-[44px]"
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
                    className="py-3 px-5 bg-[var(--wedding-surface-alt)] hover:bg-[var(--wedding-border)] text-[var(--wedding-text)] text-sm font-medium rounded-xl transition-colors flex items-center gap-2 template-focus-ring cursor-pointer border border-[var(--wedding-border-subtle)] min-h-[44px]"
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
