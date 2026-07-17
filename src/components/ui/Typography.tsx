import type { ReactNode } from "react";
import { C, FONT_DISPLAY } from "@/constants";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 12 }}>
      {children}
    </div>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return (
    <div style={{ fontSize: 13, color: C.slateSoft, padding: "18px 0", textAlign: "center" }}>
      {text}
    </div>
  );
}
