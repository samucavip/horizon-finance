"use client";

import { useState } from "react";
import { Edit2, Trash2, Upload } from "lucide-react";
import { Button, Card, EmptyHint, IconBadge, Loading, Select } from "@/components/ui";
import { C } from "@/constants";
import { formatCurrency, formatDateBR, monthKey } from "@/utils";
import { useFinanceData } from "@/hooks";
import { useUiStore } from "@/stores/ui-store";
import { useDeleteTransaction } from "../hooks/useTransactions";

export function TransactionsView() {
  const { accounts, categories, transactions, isLoading } = useFinanceData();
  const month = useUiStore((s) => s.month);
  const openTransactionModal = useUiStore((s) => s.openTransactionModal);
  const openModal = useUiStore((s) => s.openModal);
  const deleteTx = useDeleteTransaction();

  const [filterAccount, setFilterAccount] = useState("all");

  if (isLoading) return <Loading />;

  const list = transactions
    .filter((t) => monthKey(t.date) === month)
    .filter((t) => filterAccount === "all" || t.accountId === filterAccount)
    .sort((a, b) => b.date.localeCompare(a.date));

  const categoryById = (id: string | null) => categories.find((c) => c.id === id);
  const accountById = (id: string) => accounts.find((a) => a.id === id);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <Select value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)} style={{ width: 200 }}>
          <option value="all">Todas as contas</option>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Select>
        <Button variant="ghost" onClick={() => openModal("import")}>
          <Upload size={14} />Importar CSV
        </Button>
      </div>
      <Card style={{ padding: 4 }}>
        {list.length === 0 ? (
          <EmptyHint text="Nenhum lançamento neste mês." />
        ) : (
          list.map((t) => {
            const cat = categoryById(t.categoryId);
            const acc = accountById(t.accountId);
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderBottom: `1px solid ${C.paperDim}` }}>
                <IconBadge name={cat ? cat.icon : t.type === "transfer" ? "Repeat" : "Receipt"} color={cat ? cat.color : C.slate} size={15} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.description}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.slateSoft }}>
                    {acc?.name} · {formatDateBR(t.date)} {cat ? `· ${cat.name}` : ""} · {t.paymentMethod === "credit" ? "crédito" : "débito"}
                  </div>
                </div>
                <div className="tabular" style={{ fontSize: 14, fontWeight: 700, color: t.amount < 0 ? C.coral : C.emerald, minWidth: 100, textAlign: "right" }}>
                  {t.amount < 0 ? "-" : "+"}{formatCurrency(Math.abs(t.amount), acc?.currency ?? "BRL")}
                </div>
                <button onClick={() => openTransactionModal(t)} aria-label="Editar" style={iconBtn}><Edit2 size={14} /></button>
                <button onClick={() => deleteTx.mutate(t.id)} aria-label="Excluir" style={iconBtn}><Trash2 size={14} /></button>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", color: C.slateSoft,
};
