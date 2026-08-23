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
    src: "/template-assets/photos/gallery/gallery-01-ceremony.webp",
    alt: "Celebration highlights and entrance",
    caption: "The Grand Entrance",
    folioLabel: "MEMORY // 01",
    width: 2752,
    height: 1536,
    orientation: "portrait",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "gallery-02",
    src: "/template-assets/photos/gallery/gallery-02-bride.webp",
    alt: "Celebrant portrait",
    caption: "Celebrant Solo Portrait",
    folioLabel: "MEMORY // 02",
    width: 1536,
    height: 2752,
    orientation: "portrait",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "gallery-03",
    src: "/template-assets/photos/gallery/gallery-03-groom.webp",
    alt: "Party games and joy",
    caption: "Fun & Games",
    folioLabel: "MEMORY // 03",
    width: 1536,
    height: 2752,
    orientation: "square",
    aspectClass: "aspect-square",
  },
  {
    id: "gallery-04",
    src: "/template-assets/photos/gallery/gallery-04-silhouette.webp",
    alt: "Cake cutting and wishes",
    caption: "Cake Cutting & Wishes",
    folioLabel: "MEMORY // 04",
    width: 2752,
    height: 1536,
    orientation: "portrait",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "gallery-05",
    src: "/template-assets/photos/gallery/gallery-05-toast.webp",
    alt: "Celebration toast with family",
    caption: "Celebration Toast",
    folioLabel: "MEMORY // 05",
    width: 2752,
    height: 1536,
    orientation: "portrait",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "gallery-06",
    src: "/template-assets/photos/gallery/gallery-06-table.webp",
    alt: "Party venue atmosphere and decor",
    caption: "Party Atmosphere",
    folioLabel: "MEMORY // 06",
    width: 2752,
    height: 1536,
    orientation: "square",
    aspectClass: "aspect-square",
  },
];

export const galleryPhotos: GalleryPhotoItem[] = defaultGalleryPlaceholders;
