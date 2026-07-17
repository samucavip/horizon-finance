import { forwardRef, type InputHTMLAttributes } from "react";
import { C, FONT_SANS } from "@/constants";
import { sx } from "@/lib/style";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 9,
  border: `1px solid ${C.line}`,
  fontSize: 14,
  fontFamily: FONT_SANS,
  color: C.ink,
  boxSizing: "border-box",
  background: C.paper,
};

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { style, ...rest },
  ref,
) {
  return <input ref={ref} style={sx(inputStyle, style)} {...rest} />;
});
