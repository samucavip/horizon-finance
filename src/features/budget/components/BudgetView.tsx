"use client";

import { AlertTriangle } from "lucide-react";
import { Card, EmptyHint, IconBadge, Loading, ProgressBar } from "@/components/ui";
import { C } from "@/constants";
import {
  categorySpent, formatCurrency, monthPace, monthTransactions, topLevelCategories,
} from "@/utils";
import { useFinanceData } from "@/hooks";
import { useUiStore } from "@/stores/ui-store";

export function BudgetView() {
  const { accounts, categories, transactions, exchangeRate, isLoading } = useFinanceData();
  const month = useUiStore((s) => s.month);

  if (isLoading) return <Loading />;

  const monthTx = monthTransactions(transactions, month);
  const pacePct = monthPace(month) * 100;
  const withBudget = topLevelCategories(categories).filter((c) => c.budget > 0);
  const spentOf = (id: string) => categorySpent(id, categories, monthTx, accounts, exchangeRate);
  const alerts = withBudget.filter((c) => spentOf(c.id) / c.budget > 0.9);

  return (
    <div>
      {alerts.length > 0 && (
        <Card style={{ padding: 14, marginBottom: 14, background: C.coralSoft, border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.coral }}>
            <AlertTriangle size={16} />
            {alerts.length} categoria(s) perto ou acima do orçamento: {alerts.map((a) => a.name).join(", ")}
          </div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
        {withBudget.map((cat) => {
          const spent = spentOf(cat.id);
          const pct = Math.min(100, (spent / cat.budget) * 100);
          const tone = pct >= 100 ? C.coral : pct >= 70 ? C.amber : C.emerald;
          return (
            <Card key={cat.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <IconBadge name={cat.icon} color={cat.color} size={15} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, flex: 1 }}>{cat.name}</span>
                <span className="tabular" style={{ fontSize: 12, color: C.slate }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <ProgressBar value={pct} color={tone} markerPct={pacePct} markerLabel="ritmo esperado do mês" />
              </div>
              <div className="tabular" style={{ fontSize: 12.5, color: C.slate }}>
                {formatCurrency(spent, "BRL")} de {formatCurrency(cat.budget, "BRL")}
              </div>
            </Card>
          );
        })}
        {withBudget.length === 0 && (
          <EmptyHint text="Defina orçamentos nas categorias para acompanhar aqui." />
        )}
      </div>
    </div>
  );
}
