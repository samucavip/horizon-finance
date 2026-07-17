import type { ReactNode } from "react";
import { X } from "lucide-react";
import { C, FONT_DISPLAY } from "@/constants";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export function Modal({ title, onClose, children, width = 480 }: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, background: "#14181Fcc", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white, borderRadius: 16, width, maxWidth: "100%", maxHeight: "88vh",
          overflowY: "auto", padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>
            {title}
          </h3>
          <button
            aria-label="Fechar"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.slate }}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
