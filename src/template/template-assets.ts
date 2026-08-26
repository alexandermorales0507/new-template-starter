// TEMPLATE ASSET MANIFEST.
// Local asset references for current template artwork and local images.
// Visual assets (Hero, Gallery, Love Story, Venue) are managed locally by template designers.
// Connected platform data owns event text, dates, and Gift QR codes.

export type TemplateAssets = {
  photos: {
    hero?: string;
    gallery: string[];
    story: string[];
    [key: string]: unknown;
  };
  decorations: Record<string, string>;
  backgrounds: Record<string, string>;
  illustrations: Record<string, string>;
  icons: Record<string, string>;
};

export const templateAssets: TemplateAssets = {
  photos: {
    hero: "/template-assets/photos/gallery/gallery-03-candles.webp",
    gallery: [
      "/template-assets/photos/gallery/gallery-01-action.webp",
      "/template-assets/photos/gallery/gallery-02-shield.webp",
      "/template-assets/photos/gallery/gallery-03-candles.webp",
      "/template-assets/photos/gallery/gallery-04-arcade.webp",
      "/template-assets/photos/gallery/gallery-05-confetti.webp",
      "/template-assets/photos/gallery/gallery-06-teamwork.webp",
    ],
    story: ["/template-assets/photos/story/story-origin.webp"],
  },
  decorations: {
    qrDemo: "/template-assets/decorations/qr-demo.svg",
  },
  backgrounds: {},
  illustrations: {},
  icons: {},
};
