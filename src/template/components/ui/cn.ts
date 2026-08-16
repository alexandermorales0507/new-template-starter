import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely with clsx and tailwind-merge.
 * Generic utility with zero domain knowledge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
