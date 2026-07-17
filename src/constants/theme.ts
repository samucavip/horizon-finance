// Design tokens. Kept centralized so the whole app shares one palette and
// components never hardcode hex values.
export const C = {
  ink: "#14181F",
  inkSoft: "#1E2430",
  paper: "#F5F6F2",
  paperDim: "#EAE8E1",
  line: "#DDDAD1",
  slate: "#5B6270",
  slateSoft: "#8A8F99",
  emerald: "#1F7A5C",
  emeraldSoft: "#DCEEE6",
  amber: "#C88A2E",
  amberSoft: "#F5E6CC",
  coral: "#BE4B3C",
  coralSoft: "#F4DFDA",
  steel: "#2D6E8E",
  steelSoft: "#DCE9EE",
  violet: "#7C5CBF",
  white: "#FFFFFF",
} as const;

export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

export const FONT_SANS = "'IBM Plex Sans',sans-serif";
export const FONT_DISPLAY = "'Space Grotesk',sans-serif";
export const FONT_MONO = "'IBM Plex Mono',monospace";
