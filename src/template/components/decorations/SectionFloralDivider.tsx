import Image from "next/image";
import { sageDecorations } from "@/template/template-assets";
import { cn } from "../ui/cn";

export interface SectionFloralDividerProps {
  position?: "bottom" | "top";
  className?: string;
}

/**
 * Section Floral Divider decorative ornament for Sage Estate section transitions.
 * Repurposes the grand parterre floral crest (Asset 3) as an authentic boundary threshold
 * with effectively zero normal-flow height impact (absolute boundary overlap).
 */
export function SectionFloralDivider({
  position = "bottom",
  className,
}: SectionFloralDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute left-1/2 -translate-x-1/2 translate-y-1/2 z-[15] pointer-events-none select-none",
        "w-44 sm:w-56 md:w-72 lg:w-80",
        position === "bottom"
          ? "-bottom-6 sm:-bottom-8 md:-bottom-10"
          : "-top-6 sm:-top-8 md:-top-10",
        className
      )}
    >
      <Image
        src={sageDecorations.parterreGrand}
        alt=""
        width={320}
        height={240}
        className="w-full h-auto object-contain mx-auto opacity-90"
      />
    </div>
  );
}
