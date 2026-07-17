import { resolveIcon } from "@/constants";

interface IconBadgeProps {
  name?: string | null;
  color: string;
  size?: number;
}

export function IconBadge({ name, color, size = 18 }: IconBadgeProps) {
  const Icon = resolveIcon(name);
  return (
    <div style={{
      width: size + 18, height: size + 18, borderRadius: 10, background: color + "22",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={size} color={color} strokeWidth={2} />
    </div>
  );
}
