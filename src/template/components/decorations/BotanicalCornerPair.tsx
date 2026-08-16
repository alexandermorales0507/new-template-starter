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
    // Countdown number cards (~36px mobile, 42px tablet, 48px desktop)
    dimensionClass: "w-9 h-9 sm:w-[42px] sm:h-[42px] md:w-12 md:h-12",
    leftOffsetClass:
      "-top-[10px] -left-[10px] sm:-top-[12px] sm:-left-[12px] md:-top-[14px] md:-left-[14px]",
    rightOffsetClass:
      "-top-[10px] -right-[10px] sm:-top-[12px] sm:-right-[12px] md:-top-[14px] md:-right-[14px]",
    pixelDim: 48,
  },
  sm: {
    // Timeline, Entourage, Guestbook cards (~52px mobile, 64px tablet, 72px desktop)
    dimensionClass: "w-[52px] h-[52px] sm:w-16 sm:h-16 md:w-[72px] md:h-[72px]",
    leftOffsetClass:
      "-top-[14px] -left-[14px] sm:-top-[18px] sm:-left-[18px] md:-top-[20px] md:-left-[20px]",
    rightOffsetClass:
      "-top-[14px] -right-[14px] sm:-top-[18px] sm:-right-[18px] md:-top-[20px] md:-right-[20px]",
    pixelDim: 72,
  },
  md: {
    // Ceremony, Venue, Reception, Music, Sponsors, Attire, Extra Info, Gifts (~72px mobile, 88px tablet, 104px desktop)
    dimensionClass: "w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] md:w-[104px] md:h-[104px]",
    leftOffsetClass:
      "-top-[20px] -left-[20px] sm:-top-[24px] sm:-left-[24px] md:-top-[28px] md:-left-[28px]",
    rightOffsetClass:
      "-top-[20px] -right-[20px] sm:-top-[24px] sm:-right-[24px] md:-top-[28px] md:-right-[28px]",
    pixelDim: 104,
  },
  lg: {
    // RSVP master reference (~96px mobile, 128px tablet, 160-192px desktop)
    dimensionClass: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48",
    leftOffsetClass:
      "-top-6 -left-6 sm:-top-8 sm:-left-8 md:-top-10 md:-left-10 lg:-top-12 lg:-left-12",
    rightOffsetClass:
      "-top-6 -right-6 sm:-top-8 sm:-right-8 md:-top-10 md:-right-10 lg:-top-12 lg:-right-12",
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
