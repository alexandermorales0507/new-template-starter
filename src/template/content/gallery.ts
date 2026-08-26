/**
 * Gallery Content Manifest (Glasshouse Ledger)
 *
 * Canonical template asset metadata for the kinetic photo gallery.
 * Scalable 6-photo pipeline with varied aspect ratios.
 */

export type GalleryOrientation = "portrait" | "landscape" | "square";

export interface GalleryPhotoItem {
  id: string;
  src?: string;
  alt?: string;
  caption?: string;
  folioLabel?: string;
  width?: number;
  height?: number;
  orientation?: GalleryOrientation;
  aspectClass?: string;
}

export const defaultGalleryPlaceholders: GalleryPhotoItem[] = [
  {
    id: "gallery-01",
    src: "/template-assets/photos/gallery/gallery-01-action.webp",
    alt: "Superhero leap and action training",
    caption: "The Superhero Leap",
    folioLabel: "ACTION // 01",
    width: 2752,
    height: 1536,
    orientation: "landscape",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: "gallery-02",
    src: "/template-assets/photos/gallery/gallery-02-shield.webp",
    alt: "Shield defense tactical maneuver",
    caption: "Shield Defense Practice",
    folioLabel: "DEFENSE // 02",
    width: 2752,
    height: 1536,
    orientation: "landscape",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: "gallery-03",
    src: "/template-assets/photos/gallery/gallery-03-candles.webp",
    alt: "Michael blowing out 10th birthday candles",
    caption: "The Birthday Wish Mission",
    folioLabel: "MISSION // 03",
    width: 2752,
    height: 1536,
    orientation: "landscape",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: "gallery-04",
    src: "/template-assets/photos/gallery/gallery-04-arcade.webp",
    alt: "High-score arcade gaming challenge",
    caption: "Arcade Battle Zone",
    folioLabel: "INTEL // 04",
    width: 2752,
    height: 1536,
    orientation: "landscape",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: "gallery-05",
    src: "/template-assets/photos/gallery/gallery-05-confetti.webp",
    alt: "Falling confetti celebration",
    caption: "Victory Celebration",
    folioLabel: "TRIUMPH // 05",
    width: 2752,
    height: 1536,
    orientation: "landscape",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: "gallery-06",
    src: "/template-assets/photos/gallery/gallery-06-teamwork.webp",
    alt: "Avengers squad high-five and teamwork",
    caption: "Avengers Assemble High-Five",
    folioLabel: "SQUAD // 06",
    width: 2752,
    height: 1536,
    orientation: "landscape",
    aspectClass: "aspect-[16/9]",
  },
];

export const galleryPhotos: GalleryPhotoItem[] = defaultGalleryPlaceholders;
export const galleryPhotosMobile: GalleryPhotoItem[] = defaultGalleryPlaceholders;
