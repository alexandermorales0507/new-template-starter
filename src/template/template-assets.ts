// TEMPLATE ASSET MANIFEST.
// Local asset references for current template artwork and local images.
// Visual assets (Hero, Gallery, Love Story, Venue) are managed locally by template designers.
// Connected platform data owns event text, dates, and Gift QR codes.

export type TemplateAssets = {
  photos: {
    hero?: string;
    gallery: string[];
    story: string[];
    venue?: string;
    [key: string]: unknown;
  };
  decorations: Record<string, string>;
  backgrounds: Record<string, string>;
  illustrations: Record<string, string>;
  icons: Record<string, string>;
};

export const templateAssets: TemplateAssets = {
  photos: {
    hero: "/template-assets/photos/hero/hero-portrait.webp",
    gallery: [
      "/template-assets/photos/gallery/gallery-01-ceremony.webp",
      "/template-assets/photos/gallery/gallery-02-bride.webp",
      "/template-assets/photos/gallery/gallery-03-groom.webp",
      "/template-assets/photos/gallery/gallery-04-silhouette.webp",
      "/template-assets/photos/gallery/gallery-05-toast.webp",
      "/template-assets/photos/gallery/gallery-06-table.webp",
    ],
    story: ["/template-assets/photos/story/story-journal.webp"],
    venue: "/template-assets/photos/venue/venue-grounds.webp",
  },
  decorations: {
    qrDemo: "/template-assets/decorations/qr-demo.svg",
  },
  backgrounds: {},
  illustrations: {},
  icons: {},
};

export const sageDecorations = {
  glasshouseCornerLeft: "/template-assets/decorations/sage-glasshouse-corner-left.webp",
  glasshouseCornerRight: "/template-assets/decorations/sage-glasshouse-corner-right.webp",
  parterreGrand: "/template-assets/decorations/sage-parterre-estate-floral-grand.webp",
  glasshouseGridPattern: "/template-assets/backgrounds/sage-glasshouse-grid-pattern.webp",
  parterreTrellisPattern: "/template-assets/backgrounds/sage-parterre-trellis-pattern.webp",
} as const;
