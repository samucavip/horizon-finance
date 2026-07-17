import type { LucideIcon } from "lucide-react";
import { C, FONT_MONO } from "@/constants";
import { Card } from "./Card";

type Tone = "ink" | "steel" | "emerald" | "coral";

interface StatCardProps {
  label: string;
  value: string;
  tone: Tone;
  icon: LucideIcon;
}

const tones: Record<Tone, { bg: string; fg: string; sub: string }> = {
  ink: { bg: C.ink, fg: C.white, sub: "#B8BCC4" },
  steel: { bg: C.steelSoft, fg: C.ink, sub: C.steel },
  emerald: { bg: C.emeraldSoft, fg: C.ink, sub: C.emerald },
  coral: { bg: C.coralSoft, fg: C.ink, sub: C.coral },
};

export function StatCard({ label, value, tone, icon: Icon }: StatCardProps) {
  const t = tones[tone];
  return (
    <Card style={{ padding: 16, background: t.bg, border: tone === "ink" ? "none" : `1px solid ${C.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: tone === "ink" ? t.sub : C.slate }}>{label}</span>
        <Icon size={15} color={t.sub} />
      </div>
      <div style={{ fontFamily: FONT_MONO, fontVariantNumeric: "tabular-nums", fontSize: 21, fontWeight: 700, color: t.fg, marginTop: 8 }}>
        {value}
      </div>
    </Card>
  );
}
