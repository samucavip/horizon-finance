"use client";

import { Globe, Plus } from "lucide-react";
import { Button, Card, Loading, Pill } from "@/components/ui";
import { C } from "@/constants";
import { accountBalance, accountProjected, formatCurrency, todayISO } from "@/utils";
import { useFinanceData } from "@/hooks";
import { useUiStore } from "@/stores/ui-store";

export function AccountsView() {
  const { accounts, transactions, isLoading } = useFinanceData();
  const month = useUiStore((s) => s.month);
  const openModal = useUiStore((s) => s.openModal);

  if (isLoading) return <Loading />;

  const regularAccounts = accounts.filter((a) => a.type !== "credit");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button variant="ghost" onClick={() => openModal("account")}>
          <Plus size={14} />Nova conta
        </Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
        {regularAccounts.map((a) => (
          <Card key={a.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Pill bg={a.country === "BR" ? C.emeraldSoft : C.steelSoft} fg={a.country === "BR" ? C.emerald : C.steel}>
                <Globe size={11} />{a.country} · {a.currency}
              </Pill>
              <span style={{ fontSize: 11, color: C.slateSoft, textTransform: "uppercase", letterSpacing: 0.4 }}>
                {a.type === "checking" ? "Conta corrente" : a.type === "savings" ? "Poupança" : a.type}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 10 }}>{a.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.slate, marginBottom: 3 }}>
              <span>Saldo atual</span>
              <span className="tabular" style={{ fontWeight: 700, color: C.ink }}>
                {formatCurrency(accountBalance(a, transactions, todayISO()), a.currency)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.slate }}>
              <span>Previsto fim do mês</span>
              <span className="tabular" style={{ fontWeight: 600, color: C.steel }}>
                {formatCurrency(accountProjected(a, transactions, month), a.currency)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
