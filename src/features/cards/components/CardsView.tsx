"use client";

import { Card, EmptyHint, IconBadge, Loading, Pill, ProgressBar } from "@/components/ui";
import { C } from "@/constants";
import { formatCurrency, monthKey } from "@/utils";
import { useFinanceData } from "@/hooks";
import { useUiStore } from "@/stores/ui-store";

export function CardsView() {
  const { accounts, transactions, isLoading } = useFinanceData();
  const month = useUiStore((s) => s.month);

  if (isLoading) return <Loading />;

  const cards = accounts.filter((a) => a.type === "credit");

  if (cards.length === 0) {
    return <EmptyHint text="Nenhum cartão de crédito cadastrado. Crie uma conta do tipo cartão." />;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
      {cards.map((card) => {
        const cardTx = transactions.filter((t) => t.accountId === card.id && monthKey(t.date) === month);
        const spent = cardTx.reduce((s, t) => s + Math.abs(t.amount), 0);
        const usage = card.limit ? Math.min(100, (spent / card.limit) * 100) : 0;
        return (
          <Card key={card.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <IconBadge name="CreditCard" color={card.country === "BR" ? C.emerald : C.steel} size={15} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{card.name}</div>
                  <div style={{ fontSize: 11, color: C.slateSoft }}>
                    Fecha dia {card.closingDay} · Vence dia {card.dueDay}
                  </div>
                </div>
              </div>
              <Pill bg={card.country === "BR" ? C.emeraldSoft : C.steelSoft} fg={card.country === "BR" ? C.emerald : C.steel}>
                {card.currency}
              </Pill>
            </div>
            <div className="tabular" style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>
              {formatCurrency(spent, card.currency)}
            </div>
            <div style={{ fontSize: 11.5, color: C.slateSoft, marginBottom: 8 }}>
              fatura atual · limite {formatCurrency(card.limit ?? 0, card.currency)}
            </div>
            <ProgressBar value={usage} color={usage > 85 ? C.coral : C.steel} height={7} />
            <div style={{ marginTop: 12 }}>
              {cardTx.slice(0, 4).map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderTop: `1px solid ${C.paperDim}` }}>
                  <span style={{ color: C.slate, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                    {t.description}
                  </span>
                  <span className="tabular" style={{ color: C.ink, fontWeight: 600 }}>
                    {formatCurrency(Math.abs(t.amount), card.currency)}
                  </span>
                </div>
              ))}
              {cardTx.length === 0 && <EmptyHint text="Sem lançamentos na fatura deste mês." />}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
