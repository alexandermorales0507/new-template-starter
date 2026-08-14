"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Music, Play, Pause, Square, Volume2, VolumeX, X } from "lucide-react";

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
      if (iframeReadyRef.current) {
        sendYoutubeCommand("playVideo");
        setPlaybackState("playing");
      } else {
        pendingPlayRef.current = true;
        setPlaybackState("playing");
      }
      return;
    }

    setPlaybackState("playing");
  }, [sourceType, musicLink, isMuted]);

  const pause = useCallback(() => {
    setPlaybackState("paused");
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
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      sendYoutubeCommand("playVideo");
    }
  };

  // Render hidden YouTube iframe player if YouTube ID is detected
  const renderHiddenYoutubePlayer = () => {
    if (sourceType !== "youtube" || !youtubeId) return null;

    const params = new URLSearchParams({
      enablejsapi: "1",
      autoplay: "0",
      controls: "0",
      rel: "0",
      playsinline: "1",
      playlist: youtubeId,
      loop: "1",
    });

    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;

    return (
      <div
        className="fixed pointer-events-none opacity-0 w-0 h-0 overflow-hidden"
        style={{ left: "-9999px", top: "-9999px" }}
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          id="youtube-ambient-player"
          width="1"
          height="1"
          src={embedUrl}
          title="Wedding Music Player"
          allow="autoplay; encrypted-media"
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

  // Suppress floating bubble when the in-page #music_effects section is in view
  useEffect(() => {
    const musicSection = document.querySelector("#music_effects");
    if (!musicSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsMusicSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.25);
      },
      { threshold: [0, 0.25, 0.5] }
    );

    observer.observe(musicSection);
    return () => observer.disconnect();
  }, []);

  // Show floating bubble only after music has been activated (playing or paused)
  if (playbackState === "idle" || playbackState === "stopped") {
    return null;
  }

  const title = musicTitle || "Wedding Song";
  const isInline = layout === "inline";

  return (
    <div
      className={
        isInline
          ? `relative z-10 flex shrink-0 flex-col items-end transition-opacity duration-300 ${
              isMusicSectionVisible ? "opacity-0 pointer-events-none" : "opacity-100"
            }`
          : `fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end transition-opacity duration-300 ${
              isMusicSectionVisible ? "opacity-0 pointer-events-none" : "opacity-100"
            }`
      }
    >
      {isExpanded && (
        <div
          className={`mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 p-4 shadow-xl text-gray-900 select-none animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            isInline ? "absolute bottom-full right-0" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-2.5 items-center min-w-0">
              <div
                className={`w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white shrink-0 ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "6s" }}
              >
                <Music className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Now Playing
                </p>
                <h4 className="text-sm font-semibold text-gray-900 truncate" title={title}>
                  {title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md template-focus-ring"
              aria-label="Minimize player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 justify-center pt-2 border-t border-gray-100">
            {isPlaying ? (
              <button
                type="button"
                onClick={pause}
                className="py-1.5 px-3 bg-gray-900 text-white rounded-md text-xs font-medium flex items-center gap-1.5 hover:bg-gray-800 transition cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={play}
                className="py-1.5 px-3 bg-gray-900 text-white rounded-md text-xs font-medium flex items-center gap-1.5 hover:bg-gray-800 transition cursor-pointer"
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
              className="py-1.5 px-3 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center gap-1.5 hover:bg-gray-200 transition cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}

      {/* Main floating bubble trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`rounded-full bg-gray-900 text-white shadow-xl hover:bg-gray-800 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none template-focus-ring shrink-0 ${
          compact ? "w-9 h-9 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-11 sm:h-11"
        }`}
        aria-label="Wedding song controls"
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className={compact ? "w-4 h-4 animate-pulse" : "w-5 h-5 animate-pulse"} />
        ) : (
          <VolumeX className={compact ? "w-4 h-4 opacity-75" : "w-5 h-5 opacity-75"} />
        )}
      </button>
    </div>
  );
}
