import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { C } from "@/constants";
import { sx } from "@/lib/style";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  style?: CSSProperties;
}

export function Card({ children, style, ...rest }: CardProps) {
  return (
    <div
      style={sx(
        { background: C.white, border: `1px solid ${C.line}`, borderRadius: 14 },
        style,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
