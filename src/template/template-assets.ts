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
    hero: "/template-assets/photos/hero/hero-placeholder.svg",
    gallery: [
      "/template-assets/photos/gallery/gallery-1.svg",
      "/template-assets/photos/gallery/gallery-2.svg",
      "/template-assets/photos/gallery/gallery-3.svg",
      "/template-assets/photos/gallery/gallery-4.svg",
    ],
    story: ["/template-assets/photos/story/story-1.svg"],
    venue: "/template-assets/photos/venue/venue-placeholder.svg",
  },
  decorations: {
    qrDemo: "/template-assets/decorations/qr-demo.svg",
  },
  backgrounds: {},
  illustrations: {},
  icons: {},
};
