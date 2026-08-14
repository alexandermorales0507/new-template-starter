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
  id: "custom-wedding-starter",
  name: "Custom Wedding Template Starter",
  version: 2,
  description: "WebSerbisyo Custom Wedding Template Starter with design system foundation.",
  palette: [
    { name: "Navy Slate", hex: "#334155" },
    { name: "Muted Blue", hex: "#64748b" },
    { name: "Soft Sky", hex: "#cbd5e1" },
    { name: "Warm Cream", hex: "#f1f5f9" },
  ],
};
