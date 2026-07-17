import type { ButtonHTMLAttributes, ReactNode } from "react";
import { C, FONT_SANS } from "@/constants";
import { sx } from "@/lib/style";

type Variant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base = {
  borderRadius: 9,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: FONT_SANS,
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
} as const;

const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: C.ink, color: C.white, border: "none" },
  ghost: { background: "transparent", color: C.ink, border: `1px solid ${C.line}` },
};

export function Button({ variant = "primary", style, disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      style={sx(base, variants[variant], disabled ? { opacity: 0.5, cursor: "not-allowed" } : null, style)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
