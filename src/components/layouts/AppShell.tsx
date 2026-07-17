"use client";

import type { ReactNode } from "react";
import { C, FONT_SANS, FONT_IMPORT } from "@/constants";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ModalHost } from "./ModalHost";

// Application chrome: sidebar + topbar + routed content, plus the global modal
// host driven by the UI store.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_SANS, background: C.paper, minHeight: "100vh",
      overflow: "hidden", border: `1px solid ${C.line}`,
    }}>
      <style>{FONT_IMPORT}{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${C.steel}; outline-offset: 1px; }
        .tabular { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "22px 26px", minWidth: 0 }}>
          <Topbar />
          {children}
        </main>
      </div>

      <ModalHost />
    </div>
  );
}
