"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, LogOut } from "lucide-react";
import { APP_NAME, C, FONT_DISPLAY, FONT_SANS, NAV_ITEMS } from "@/constants";
import { useLogout } from "@/features/auth";

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <nav style={{ width: 210, background: C.ink, padding: "22px 14px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "0 8px 22px",
        borderBottom: "1px solid #ffffff1a", marginBottom: 16,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: C.emerald,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Landmark size={16} color={C.white} />
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.white, fontSize: 15 }}>
          {APP_NAME}
        </span>
      </div>

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.key}
            href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px",
              borderRadius: 9, marginBottom: 3, textDecoration: "none",
              background: active ? "#ffffff14" : "transparent",
              color: active ? C.white : "#B8BCC4", fontSize: 13.5, fontWeight: 500,
              fontFamily: FONT_SANS,
            }}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}

      <button
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px",
          borderRadius: 9, border: "none", cursor: "pointer", marginTop: "auto",
          background: "transparent", color: "#B8BCC4", fontSize: 13.5, fontWeight: 500,
          fontFamily: FONT_SANS, textAlign: "left",
        }}
      >
        <LogOut size={16} />
        Sair
      </button>
    </nav>
  );
}
