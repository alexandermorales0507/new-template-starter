export type PetalColorTuple = {
  highlight: string;
  base: string;
  shadow: string;
  vein: string;
};

export type PetalTheme = {
  light: PetalColorTuple;
  secondary: PetalColorTuple;
  primary: PetalColorTuple;
  metallic: PetalColorTuple;
  botanical: PetalColorTuple;
  canvasShadow: string;
};

export const DEFAULT_SAGE_PETAL_THEME: PetalTheme = {
  light: {
    highlight: "#fffdf7",
    base: "#f7f4ea",
    shadow: "#e8e2d2",
    vein: "#c5bc9f",
  },
  secondary: {
    highlight: "#e8efe0",
    base: "#dde5d3",
    shadow: "#b8c4a9",
    vein: "#97a884",
  },
  primary: {
    highlight: "#a8be92",
    base: "#8fa878",
    shadow: "#6f8857",
    vein: "#4e653a",
  },
  metallic: {
    highlight: "#e2cca3",
    base: "#c9a86a",
    shadow: "#a7864b",
    vein: "#7d612e",
  },
  botanical: {
    highlight: "#4a6354",
    base: "#304438",
    shadow: "#213027",
    vein: "#151f19",
  },
  canvasShadow: "rgba(23, 33, 27, 0.10)",
};

function readTuple(
  styles: CSSStyleDeclaration,
  prefix: string,
  fallback: PetalColorTuple
): PetalColorTuple {
  const highlight = styles.getPropertyValue(`${prefix}-highlight`).trim();
  const base = styles.getPropertyValue(`${prefix}-base`).trim();
  const shadow = styles.getPropertyValue(`${prefix}-shadow`).trim();
  const vein = styles.getPropertyValue(`${prefix}-vein`).trim();

  return {
    highlight: highlight || fallback.highlight,
    base: base || fallback.base,
    shadow: shadow || fallback.shadow,
    vein: vein || fallback.vein,
  };
}

/**
 * Resolves the active petal theme from CSS custom properties inherited by the
 * canvas element. Reads computed styles ONCE on animation initialization and
 * falls back gracefully to typed Sage defaults.
 */
export function resolvePetalTheme(element: HTMLElement | null): PetalTheme {
  if (!element || typeof window === "undefined" || !window.getComputedStyle) {
    return DEFAULT_SAGE_PETAL_THEME;
  }

  const target = element.closest("[data-wedding-theme]") ?? document.documentElement;
  const styles = window.getComputedStyle(target);

  const canvasShadow = styles.getPropertyValue("--event-petal-canvas-shadow").trim();

  return {
    light: readTuple(styles, "--event-petal-light", DEFAULT_SAGE_PETAL_THEME.light),
    secondary: readTuple(styles, "--event-petal-secondary", DEFAULT_SAGE_PETAL_THEME.secondary),
    primary: readTuple(styles, "--event-petal-primary", DEFAULT_SAGE_PETAL_THEME.primary),
    metallic: readTuple(styles, "--event-petal-metallic", DEFAULT_SAGE_PETAL_THEME.metallic),
    botanical: readTuple(styles, "--event-petal-botanical", DEFAULT_SAGE_PETAL_THEME.botanical),
    canvasShadow: canvasShadow || DEFAULT_SAGE_PETAL_THEME.canvasShadow,
  };
}
