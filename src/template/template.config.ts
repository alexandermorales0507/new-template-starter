// TEMPLATE METADATA — CUSTOM TEMPLATE IDENTITY ONLY.
// Do not place client names, event dates, eventSlugs, or credentials here.

export type TemplateColorSwatch = {
  name: string;
  hex: string;
};

export type TemplateConfig = {
  id: string;
  name: string;
  version: number;
  description: string;
  palette: TemplateColorSwatch[];
};

export const templateConfig: TemplateConfig = {
  id: "template-birthday-avengers-10th",
  name: "Avengers Assemble — Comic Paper Edition",
  version: 1,
  description:
    "Action comic paper card template with bold halftone dots, dynamic superhero palettes, and zero-blur ink drop shadows.",
  palette: [
    { name: "Marvel Crimson", hex: "#DC2626" },
    { name: "Stark Gold", hex: "#F59E0B" },
    { name: "Arc Cyan", hex: "#0284C7" },
    { name: "Comic Ink", hex: "#0F172A" },
    { name: "Action White", hex: "#FFFFFF" },
  ],
};
