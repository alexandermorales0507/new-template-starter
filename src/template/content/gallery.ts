/**
 * Gallery Content Manifest (Glasshouse Ledger)
 *
 * Canonical template asset metadata for the kinetic photo gallery.
 * Matches high-resolution wedding photography assets.
 */

export type GalleryOrientation = "portrait" | "landscape" | "square";

export interface GalleryPhotoItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  folioLabel: string;
  width: number;
  height: number;
  orientation: GalleryOrientation;
}

export const galleryPhotos: GalleryPhotoItem[] = [
  {
    id: "gallery-01",
    src: "/template-assets/photos/gallery/gallery-01-ceremony.webp",
    alt: "Wedding ceremony arch in a garden setting",
    caption: "The Ceremony Arch",
    folioLabel: "FOLIO // 01",
    width: 2752,
    height: 1536,
    orientation: "landscape",
  },
  {
    id: "gallery-02",
    src: "/template-assets/photos/gallery/gallery-02-bride.webp",
    alt: "Portrait of the bride in her wedding gown",
    caption: "The Bride",
    folioLabel: "FOLIO // 02",
    width: 1536,
    height: 2752,
    orientation: "portrait",
  },
  {
    id: "gallery-03",
    src: "/template-assets/photos/gallery/gallery-03-groom.webp",
    alt: "Portrait of the groom in a black tuxedo",
    caption: "The Groom",
    folioLabel: "FOLIO // 03",
    width: 1536,
    height: 2752,
    orientation: "portrait",
  },
  {
    id: "gallery-04",
    src: "/template-assets/photos/gallery/gallery-04-silhouette.webp",
    alt: "Evening silhouette of the wedding couple",
    caption: "Midnight Silhouette",
    folioLabel: "FOLIO // 04",
    width: 2752,
    height: 1536,
    orientation: "landscape",
  },
  {
    id: "gallery-05",
    src: "/template-assets/photos/gallery/gallery-05-toast.webp",
    alt: "Candlelit wedding reception toast",
    caption: "Reception Toast",
    folioLabel: "FOLIO // 05",
    width: 2752,
    height: 1536,
    orientation: "landscape",
  },
  {
    id: "gallery-06",
    src: "/template-assets/photos/gallery/gallery-06-table.webp",
    alt: "Intimate wedding reception table setting",
    caption: "Intimate Table Setting",
    folioLabel: "FOLIO // 06",
    width: 2752,
    height: 1536,
    orientation: "landscape",
  },
];
