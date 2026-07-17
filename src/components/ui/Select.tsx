import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { inputStyle } from "./Input";
import { sx } from "@/lib/style";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { style, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} style={sx(inputStyle, style)} {...rest}>
      {children}
    </select>
  );
});
