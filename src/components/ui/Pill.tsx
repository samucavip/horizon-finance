import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  bg: string;
  fg: string;
}

export function Pill({ children, bg, fg }: PillProps) {
  return (
    <span style={{
      background: bg, color: fg, fontSize: 12, fontWeight: 600, padding: "3px 10px",
      borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {children}
    </span>
  );
}
