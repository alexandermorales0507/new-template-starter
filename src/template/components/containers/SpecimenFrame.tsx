import * as React from "react";
import Image from "next/image";
import { cn } from "../ui/cn";

export type SpecimenAspectRatio = "portrait" | "landscape" | "square" | "widescreen" | "video";

export interface SpecimenFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  caption?: string;
  specimenNumber?: string;
  aspectRatio?: SpecimenAspectRatio;
  priority?: boolean;
  rotateDeg?: number;
}

const ASPECT_CLASSES: Record<SpecimenAspectRatio, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  widescreen: "aspect-[16/10]",
  video: "aspect-[16/9]",
  square: "aspect-square",
};

export function SpecimenFrame({
  className,
  src,
  alt = "Specimen frame",
  caption,
  specimenNumber,
  aspectRatio = "portrait",
  priority = false,
  rotateDeg,
  style,
  children,
  ...props
}: SpecimenFrameProps) {
  return (
    <div
      data-surface="light"
      className={cn(
        "specimen-frame group relative rounded-2xl border-2 border-[var(--event-border)] bg-[var(--event-surface)] text-[var(--event-text)] p-3 shadow-xs transition-all hover:shadow-soft",
        className
      )}
      style={{
        ...(rotateDeg ? { transform: `rotate(${rotateDeg}deg)` } : {}),
        ...style,
      }}
      {...props}
    >
      {/* Visual Inner Frame */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-[var(--event-surface-alt)]",
          ASPECT_CLASSES[aspectRatio] || ASPECT_CLASSES.portrait
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            className="object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105 [transform:translateZ(0)]"
          />
        ) : (
          children || (
            <div className="flex h-full w-full items-center justify-center text-xs text-[var(--event-text-muted)] font-mono">
              [ SPECIMEN FRAME ]
            </div>
          )
        )}
      </div>

      {/* Archival Tag Strip */}
      {caption || specimenNumber ? (
        <div className="mt-3 flex items-center justify-between px-1 text-[11px]">
          {caption ? (
            <span className="font-medium text-[var(--event-text)] font-sans truncate max-w-[80%]">
              {caption}
            </span>
          ) : null}
          {specimenNumber ? (
            <span className="font-mono text-[10px] font-bold text-[var(--event-accent-strong,#8f6a2c)] tracking-wider">
              {specimenNumber}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
