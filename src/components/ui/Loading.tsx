import { C, FONT_SANS } from "@/constants";

export function Loading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: 400,
      fontFamily: FONT_SANS, color: C.slate,
    }}>
      {label}
    </div>
  );
}
