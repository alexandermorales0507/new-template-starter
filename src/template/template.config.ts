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
  id: "template-03-sage-estate",
  name: "Sage Estate — The Glasshouse Ledger",
  version: 1,
  description:
    "English Garden Estate architectural event template with warm ivory surfaces and conservatory sage accents.",
  palette: [
    { name: "Conservatory Sage", hex: "#657A57" },
    { name: "Mist Sage", hex: "#DDE5D3" },
    { name: "Deep Forest", hex: "#304438" },
    { name: "Antique Brass", hex: "#C9A86A" },
    { name: "Warm Cream", hex: "#F7F4EA" },
  ],
};
