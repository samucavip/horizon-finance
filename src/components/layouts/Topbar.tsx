"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Plus } from "lucide-react";
import { C, FONT_DISPLAY, FONT_MONO, NAV_ITEMS } from "@/constants";
import { Button, Input } from "@/components/ui";
import { useUiStore } from "@/stores/ui-store";
import { useSettings, useUpdateExchangeRate } from "@/features/settings";

export function Topbar() {
  const pathname = usePathname();
  const title = NAV_ITEMS.find((n) => pathname === n.href)?.label ?? "Dashboard";

  const month = useUiStore((s) => s.month);
  const setMonth = useUiStore((s) => s.setMonth);
  const openModal = useUiStore((s) => s.openModal);
  const openTransactionModal = useUiStore((s) => s.openTransactionModal);

  const { exchangeRate } = useSettings();
  const updateRate = useUpdateExchangeRate();
  const [rateInput, setRateInput] = useState(String(exchangeRate));

  useEffect(() => {
    setRateInput(String(exchangeRate));
  }, [exchangeRate]);

  const commitRate = () => {
    const value = parseFloat(rateInput);
    if (!Number.isNaN(value) && value > 0 && value !== exchangeRate) {
      updateRate.mutate(value);
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 22, flexWrap: "wrap", gap: 10,
    }}>
      <div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>
          {title}
        </h1>
        <div style={{ fontSize: 12.5, color: C.slateSoft, marginTop: 2 }}>
          Câmbio USD→BRL:{" "}
          <input
            type="number"
            step="0.01"
            value={rateInput}
            onChange={(e) => setRateInput(e.target.value)}
            onBlur={commitRate}
            aria-label="Cotação do dólar em reais"
            style={{
              width: 60, border: "none", borderBottom: `1px solid ${C.line}`,
              background: "transparent", fontFamily: FONT_MONO, fontSize: 12.5,
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="Mês de referência"
          style={{ width: 150, padding: "8px 10px" }}
        />
        <Button variant="ghost" onClick={() => openModal("transfer")}>
          <ArrowLeftRight size={14} />Transferir
        </Button>
        <Button onClick={() => openTransactionModal(null)}>
          <Plus size={14} />Lançamento
        </Button>
      </div>
    </div>
  );
}
