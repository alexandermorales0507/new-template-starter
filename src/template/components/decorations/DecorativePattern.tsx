import Image from "next/image";
import { cn } from "../ui/cn";

export interface DecorativePatternProps {
  src: string;
  alt?: string;
  opacity?: number;
  objectPosition?: string;
  blendMode?: "multiply" | "normal" | "overlay" | "soft-light";
  className?: string;
}

/**
 * Lightweight, zero-overhead background pattern renderer for Sage Estate.
 * Ensures consistent non-semantic aria-hidden, pointer-events-none, and object-cover behavior.
 */
export function DecorativePattern({
  src,
  alt = "",
  opacity = 0.12,
  objectPosition = "center center",
  blendMode = "multiply",
  className,
}: DecorativePatternProps) {
  const blendClass =
    blendMode === "multiply"
      ? "mix-blend-multiply"
      : blendMode === "overlay"
        ? "mix-blend-overlay"
        : blendMode === "soft-light"
          ? "mix-blend-soft-light"
          : "";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none z-0",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={cn("object-cover", blendClass)}
        style={{ opacity, objectPosition }}
        priority={false}
      />
    </div>
  );
}
