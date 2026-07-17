import type { CSSProperties } from "react";

// Merges style objects, ignoring undefined so callers can pass conditional
// styles inline. Keeps the app's inline-style design system ergonomic.
export function sx(...styles: (CSSProperties | undefined | false | null)[]): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}
