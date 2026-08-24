"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Square, Music4, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { parseMusicMeta } from "@/template/utils/music-meta";

export type AudioPlaybackState = "idle" | "playing" | "paused" | "stopped";
export type AudioSourceType = "direct" | "youtube" | "none";

type AudioContextType = {
  playbackState: AudioPlaybackState;
  isPlaying: boolean;
  isMuted: boolean;
  sourceType: AudioSourceType;
  musicTitle: string;
  shortNote: string;
  musicLink: string;
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setMusicData: (link: string, title?: string, note?: string) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

function isDirectAudioUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(mp3|m4a|ogg|wav|aac|flac)(\?.*)?$/i.test(url);
}

export function AudioProvider({
  children,
  initialMusicLink,
  initialMusicTitle,
  initialShortNote,
}: {
  children: React.ReactNode;
  initialMusicLink?: string;
  initialMusicTitle?: string;
  initialShortNote?: string;
}) {
  const [musicLink, setMusicLink] = useState(initialMusicLink || "");
  const [musicTitle, setMusicTitle] = useState(initialMusicTitle || "");
  const [shortNote, setShortNote] = useState(initialShortNote || "");
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>("idle");
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);

  const youtubeId = extractYoutubeId(musicLink);
  const isDirect = isDirectAudioUrl(musicLink);
  const sourceType: AudioSourceType = youtubeId
    ? "youtube"
    : musicLink
      ? isDirect
        ? "direct"
        : "direct" // fallback attempts HTML5 audio
      : "none";

  const isPlaying = playbackState === "playing";

  const setMusicData = useCallback(
    (link: string, title?: string, note?: string) => {
      if (link && link !== musicLink) {
        setMusicLink(link);
        setPlaybackState("idle");
      }
      if (title !== undefined) setMusicTitle(title);
      if (note !== undefined) setShortNote(note);
    },
    [musicLink]
  );

  // Clean up direct audio on unmount or URL change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicLink]);

  // Listen for YouTube IFrame API ready and state delivery events
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onReady" || data?.event === "initialDelivery") {
          iframeReadyRef.current = true;
          if (pendingPlayRef.current) {
            pendingPlayRef.current = false;
            sendYoutubeCommand("playVideo");
          }
        }
      } catch {
        // Ignore non-JSON postMessage payloads
      }
    };

    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
  }, []);

  // Send postMessage command to YouTube iframe
  const sendYoutubeCommand = (func: string, args: unknown = "") => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const message = JSON.stringify({ event: "command", func, args });
    iframe.contentWindow.postMessage(message, "*");
  };

  const play = useCallback(() => {
    if (sourceType === "direct" && musicLink) {
      if (!audioRef.current) {
        const audio = new Audio(musicLink);
        audio.loop = true;
        audio.addEventListener("ended", () => setPlaybackState("stopped"));
        audioRef.current = audio;
      }
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        audioRef.current
          .play()
          .then(() => {
            setPlaybackState("playing");
          })
          .catch((err) => {
            console.warn("Direct audio playback blocked or failed:", err);
            setPlaybackState("paused");
          });
        return;
      }
    }

    if (sourceType === "youtube") {
      setPlaybackState("playing");
      if (iframeReadyRef.current) {
        sendYoutubeCommand("playVideo");
      } else {
        pendingPlayRef.current = true;
        // Also send initial listening handshake
        sendYoutubeCommand("listening");
      }
      return;
    }

    setPlaybackState("playing");
  }, [sourceType, musicLink, isMuted]);

  const pause = useCallback(() => {
    setPlaybackState("paused");
    pendingPlayRef.current = false;
    if (sourceType === "direct" && audioRef.current) {
      audioRef.current.pause();
    }
    if (sourceType === "youtube") {
      sendYoutubeCommand("pauseVideo");
    }
  }, [sourceType]);

  const stop = useCallback(() => {
    setPlaybackState("stopped");
    pendingPlayRef.current = false;
    if (sourceType === "direct" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (sourceType === "youtube") {
      sendYoutubeCommand("stopVideo");
    }
  }, [sourceType]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      if (sourceType === "youtube") {
        sendYoutubeCommand(next ? "mute" : "unMute");
      }
      return next;
    });
  }, [sourceType]);

  const handleIframeLoad = () => {
    iframeReadyRef.current = true;
    sendYoutubeCommand("listening");
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      sendYoutubeCommand("playVideo");
    }
  };

  // Render hidden YouTube iframe player if YouTube ID is detected
  const renderHiddenYoutubePlayer = () => {
    if (sourceType !== "youtube" || !youtubeId) return null;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({
      enablejsapi: "1",
      autoplay: "0",
      controls: "0",
      rel: "0",
      playsinline: "1",
      playlist: youtubeId,
      loop: "1",
      ...(origin ? { origin } : {}),
    });

    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;

    return (
      <div
        className="fixed bottom-0 right-0 w-8 h-8 opacity-[0.01] pointer-events-none overflow-hidden z-[-1]"
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          id="youtube-ambient-player"
          className="w-full h-full"
          src={embedUrl}
          title="Event Ambient Audio Player"
          allow="autoplay; encrypted-media; fullscreen"
          tabIndex={-1}
          onLoad={handleIframeLoad}
        />
      </div>
    );
  };

  return (
    <AudioContext.Provider
      value={{
        playbackState,
        isPlaying,
        isMuted,
        sourceType,
        musicTitle,
        shortNote,
        musicLink,
        play,
        pause,
        stop,
        togglePlay,
        toggleMute,
        setMusicData,
      }}
    >
      {children}
      {renderHiddenYoutubePlayer()}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

export type FloatingMusicBubbleProps = {
  layout?: "fixed" | "inline";
  compact?: boolean;
};

/**
 * Floating Now-Playing Widget that coexists beside the QuickDock in the floating cluster.
 */
export function FloatingMusicBubble({
  layout = "inline",
  compact = false,
}: FloatingMusicBubbleProps) {
  const { playbackState, isPlaying, musicTitle, play, pause, stop } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMusicSectionVisible, setIsMusicSectionVisible] = useState(false);

  // Recede floating bubble when in-page #music_effects section is in viewport
  useEffect(() => {
    const musicSec = document.querySelector("#music_effects");
    if (!musicSec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsMusicSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3);
      },
      { threshold: [0, 0.3, 0.6] }
    );

    observer.observe(musicSec);
    return () => observer.disconnect();
  }, []);

  // Show floating bubble only after music has been activated (playing or paused)
  if (playbackState === "idle" || playbackState === "stopped") {
    return null;
  }

  const { displayTitle, displayArtist } = parseMusicMeta(musicTitle);
  const isInline = layout === "inline";

  return (
    <div
      className={
        isInline
          ? "relative z-10 flex shrink-0 flex-col items-end font-sans"
          : `fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end transition-opacity duration-300 font-sans ${
              isMusicSectionVisible ? "opacity-0 pointer-events-none" : "opacity-100"
            }`
      }
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className={`mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-[var(--event-surface)]/95 backdrop-blur-md border border-[var(--event-border)] p-4 shadow-2xl text-[var(--event-text)] select-none ${
              isInline ? "absolute bottom-full right-0" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 items-center min-w-0">
                {/* Mini spinning vinyl disc indicator */}
                <div
                  className={`w-9 h-9 rounded-full bg-[var(--event-surface-dark)] flex items-center justify-center text-[var(--event-accent-soft)] shrink-0 shadow-inner ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "6s" }}
                >
                  <Music4 className="w-4 h-4 text-[var(--event-accent-soft)]" />
                </div>
                <div className="min-w-0">
                  <h4
                    className="font-serif text-sm font-semibold text-[var(--event-text)] truncate leading-tight"
                    title={displayTitle}
                  >
                    {displayTitle}
                  </h4>
                  {displayArtist && (
                    <p className="text-[10px] font-mono text-[var(--event-accent-strong,#8f6a2c)] uppercase tracking-widest truncate">
                      {displayArtist}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-[var(--event-text-muted)] hover:text-[var(--event-text)] p-1 rounded-full hover:bg-[var(--event-surface-alt)] transition template-focus-ring cursor-pointer"
                aria-label="Minimize player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-[var(--event-border)]/50 to-transparent mb-3" />

            <div className="flex gap-2 justify-center">
              {isPlaying ? (
                <button
                  type="button"
                  onClick={pause}
                  className="py-1.5 px-3 bg-[var(--event-primary)] text-[var(--event-on-primary)] rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--event-primary-hover)] transition cursor-pointer shadow-xs"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={play}
                  className="py-1.5 px-3 bg-[var(--event-primary)] text-[var(--event-on-primary)] rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--event-primary-hover)] transition cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  stop();
                  setIsExpanded(false);
                }}
                className="py-1.5 px-3 bg-[var(--event-surface-alt)] text-[var(--event-text)] rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-[var(--event-border)] transition cursor-pointer border border-[var(--event-border-subtle)]"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating bubble trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`rounded-full bg-[var(--event-surface-dark)] text-[var(--event-on-dark)] shadow-2xl border-2 border-[var(--event-accent)]/50 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none template-focus-ring shrink-0 relative group ${
          compact ? "w-12 h-12" : "w-14 h-14"
        }`}
        aria-label="Audio playback controls"
        title={isPlaying ? "Pause music" : "Play music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing-music"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center justify-center"
            >
              {/* Pulsating border rings when playing */}
              <div className="absolute inset-0 -m-1.5 rounded-full border border-[var(--event-accent)] opacity-60 animate-ping pointer-events-none" />
              <Music4 className="w-6 h-6 text-[var(--event-accent)] animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="paused-music"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <Music4 className="w-6 h-6 text-[var(--event-accent-soft)] opacity-80" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
