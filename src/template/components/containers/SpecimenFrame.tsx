import * as React from "react";
import Image from "next/image";
import { cn } from "../ui/cn";

export interface SpecimenFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  caption?: string;
  specimenNumber?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "video";
  priority?: boolean;
}

export function SpecimenFrame({
  className,
  src,
  alt = "Specimen frame",
  caption,
  specimenNumber,
  aspectRatio = "portrait",
  priority = false,
  children,
  ...props
}: SpecimenFrameProps) {
  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-3/4",
    landscape: "aspect-4/3",
    video: "aspect-16/9",
  };

  return (
    <div
      data-surface="light"
      className={cn(
        "specimen-frame group relative rounded-2xl border-2 border-[var(--event-border)] bg-[var(--event-surface)] text-[var(--event-text)] p-3 shadow-xs transition-all hover:shadow-soft",
        className
      )}
      {...props}
    >
      {/* Visual Inner Frame */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-[var(--event-surface-alt)]",
          aspectClasses[aspectRatio]
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
