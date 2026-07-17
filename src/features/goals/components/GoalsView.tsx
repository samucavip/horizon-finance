"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button, Card, EmptyHint, IconBadge, Loading, ProgressBar } from "@/components/ui";
import { C } from "@/constants";
import { formatCurrency } from "@/utils";
import { useUiStore } from "@/stores/ui-store";
import { useDeleteGoal, useGoals } from "../hooks/useGoals";

export function GoalsView() {
  const { data: goals = [], isLoading } = useGoals();
  const openModal = useUiStore((s) => s.openModal);
  const deleteGoal = useDeleteGoal();

  if (isLoading) return <Loading />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button variant="ghost" onClick={() => openModal("goal")}>
          <Plus size={14} />Nova meta
        </Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
        {goals.map((g) => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <Card key={g.id} style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <IconBadge name="DollarSign" color={g.color} size={15} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{g.name}</span>
                </div>
                <button onClick={() => deleteGoal.mutate(g.id)} aria-label="Excluir" style={{ background: "none", border: "none", cursor: "pointer", color: C.slateSoft }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div style={{ marginBottom: 8 }}>
                <ProgressBar value={pct} color={g.color} />
              </div>
              <div className="tabular" style={{ fontSize: 12.5, color: C.slate }}>
                {formatCurrency(g.current, "BRL")} de {formatCurrency(g.target, "BRL")} ({pct.toFixed(0)}%)
              </div>
            </Card>
          );
        })}
        {goals.length === 0 && <EmptyHint text="Nenhuma meta criada ainda." />}
      </div>
    </div>
  );
}
