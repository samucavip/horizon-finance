import { C } from "@/constants";

interface ProgressBarProps {
  value: number; // 0..100
  color: string;
  height?: number;
  markerPct?: number; // optional reference marker (e.g. month pace)
  markerLabel?: string;
}

export function ProgressBar({ value, color, height = 8, markerPct, markerLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div style={{ height, borderRadius: 99, background: C.paperDim, overflow: "hidden", position: "relative" }}>
      <div style={{ height: "100%", width: `${clamped}%`, background: color, borderRadius: 99 }} />
      {markerPct !== undefined && (
        <div
          title={markerLabel}
          style={{
            position: "absolute", left: `${Math.min(100, markerPct)}%`, top: -2,
            width: 2, height: height + 4, background: C.ink, opacity: 0.4,
          }}
        />
      )}
    </div>
  );
}
