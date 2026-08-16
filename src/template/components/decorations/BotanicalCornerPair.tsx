import Image from "next/image";
import { sageDecorations } from "@/template/template-assets";
import { cn } from "../ui/cn";

export type BotanicalCornerSize = "xs" | "sm" | "md" | "lg";

export interface BotanicalCornerPairProps {
  size?: BotanicalCornerSize;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
  leftOffset?: string;
  rightOffset?: string;
  opacity?: number;
}

const sizeConfig: Record<
  BotanicalCornerSize,
  {
    dimensionClass: string;
    leftOffsetClass: string;
    rightOffsetClass: string;
    pixelDim: number;
  }
> = {
  xs: {
    // Countdown number cards (~24px mobile, 28px tablet, 32px desktop)
    dimensionClass: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8",
    leftOffsetClass: "-top-1.5 -left-1.5 sm:-top-2 sm:-left-2",
    rightOffsetClass: "-top-1.5 -right-1.5 sm:-top-2 sm:-right-2",
    pixelDim: 32,
  },
  sm: {
    // Timeline, Entourage, Guestbook cards (~36px mobile, 44px tablet, 48px desktop)
    dimensionClass: "w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12",
    leftOffsetClass: "-top-2 -left-2 sm:-top-2.5 sm:-left-2.5 md:-top-3 md:-left-3",
    rightOffsetClass: "-top-2 -right-2 sm:-top-2.5 sm:-right-2.5 md:-top-3 md:-right-3",
    pixelDim: 48,
  },
  md: {
    // Ceremony, Venue, Reception, Music, Sponsors, Attire, Extra Info, Gifts (~56px mobile, 64px tablet, 72-80px desktop)
    dimensionClass: "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20",
    leftOffsetClass: "-top-3 -left-3 sm:-top-4 sm:-left-4 md:-top-5 md:-left-5",
    rightOffsetClass: "-top-3 -right-3 sm:-top-4 sm:-right-4 md:-top-5 md:-right-5",
    pixelDim: 80,
  },
  lg: {
    // RSVP, Love Story Description (~96px mobile, 128px tablet, 160-192px desktop)
    dimensionClass: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48",
    leftOffsetClass:
      "-top-5 -left-5 sm:-top-7 sm:-left-7 md:-top-10 md:-left-10 lg:-top-12 lg:-left-12",
    rightOffsetClass:
      "-top-5 -right-5 sm:-top-7 sm:-right-7 md:-top-10 md:-right-10 lg:-top-12 lg:-right-12",
    pixelDim: 192,
  },
};

/**
 * Botanical Corner Pair decorative component for Sage Estate physical paper cards.
 * Renders authentic distinct Left and Right glasshouse corner artwork with accessible zero-overhead markup.
 */
export function BotanicalCornerPair({
  size = "md",
  className,
  leftClassName,
  rightClassName,
  leftOffset,
  rightOffset,
  opacity,
}: BotanicalCornerPairProps) {
  const config = sizeConfig[size];
  const opacityClass =
    opacity === 100
      ? "opacity-100"
      : opacity === 90
        ? "opacity-90"
        : opacity === 85
          ? "opacity-85"
          : opacity === 80
            ? "opacity-80"
            : "opacity-95";

  return (
    <>
      {/* Top-Left Botanical Corner */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute pointer-events-none select-none z-20 transition-all",
          config.dimensionClass,
          leftOffset || config.leftOffsetClass,
          opacityClass,
          className,
          leftClassName
        )}
      >
        <Image
          src={sageDecorations.glasshouseCornerLeft}
          alt=""
          width={config.pixelDim}
          height={config.pixelDim}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Top-Right Botanical Corner */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute pointer-events-none select-none z-20 transition-all",
          config.dimensionClass,
          rightOffset || config.rightOffsetClass,
          opacityClass,
          className,
          rightClassName
        )}
      >
        <Image
          src={sageDecorations.glasshouseCornerRight}
          alt=""
          width={config.pixelDim}
          height={config.pixelDim}
          className="w-full h-full object-contain"
        />
      </div>
    </>
  );
}
