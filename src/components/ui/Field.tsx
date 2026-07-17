import type { ReactNode } from "react";
import { C } from "@/constants";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.slate, display: "block", marginBottom: 5 }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize: 11.5, color: C.coral, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
