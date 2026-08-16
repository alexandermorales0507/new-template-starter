import Image from "next/image";
import { sageDecorations } from "@/template/template-assets";
import { cn } from "../ui/cn";

export interface SectionFloralDividerProps {
  className?: string;
  sizeClassName?: string;
}

/**
 * Section Floral Divider decorative ornament for Sage Estate section transitions.
 * Repurposes the grand parterre floral crest (Asset 3) as an authentic boundary threshold.
 *
 * GEOMETRY: absolute, bottom-0, translateY(50%) — places the VISUAL CENTER of the ornament
 * exactly on the section boundary cut. No negative bottom offset is used because that
 * would shift the center below the actual boundary, causing collisions with next-section headings.
 *
 * The owning section must have: relative + overflow-x-clip (NOT overflow-hidden).
 * Normal-flow height impact: ZERO.
 */
export function SectionFloralDivider({ className, sizeClassName }: SectionFloralDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // Exact boundary centering: bottom-0 + translate-y-1/2 = ornament center on section cut
        "absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-[15] pointer-events-none select-none",
        // Reduced size: 144px mobile → 176px tablet → 224px desktop → 256px lg
        sizeClassName ?? "w-36 sm:w-44 md:w-56 lg:w-64",
        className
      )}
    >
      <Image
        src={sageDecorations.parterreGrand}
        alt=""
        width={256}
        height={192}
        className="w-full h-auto object-contain mx-auto opacity-95"
      />
    </div>
  );
}
