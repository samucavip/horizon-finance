"use client";

import { useRef, useState } from "react";
import { Button, Field, Modal, Select } from "@/components/ui";
import { inputStyle } from "@/components/ui";
import { C } from "@/constants";
import { parseStatementCsv, type ParsedCsvRow } from "@/utils";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useUiStore } from "@/stores/ui-store";
import type { Transaction } from "@/types";
import { useCreateTransactions } from "../hooks/useTransactions";

export function ImportModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createMany = useCreateTransactions();

  const [rows, setRows] = useState<ParsedCsvRow[]>([]);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [defaultCat, setDefaultCat] = useState(categories.find((c) => !c.parentId)?.id ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRows(parseStatementCsv(String(ev.target?.result ?? "")));
    reader.readAsText(file);
  };

  const confirm = async () => {
    const payload: Omit<Transaction, "id">[] = rows.map((r) => ({
      accountId,
      date: r.date,
      description: r.description,
      amount: r.amount,
      categoryId: defaultCat || null,
      type: r.amount < 0 ? "expense" : "income",
      paymentMethod: "debit",
    }));
    await createMany.mutateAsync(payload);
    closeModal();
  };

  return (
    <Modal title="Importar extrato / fatura (CSV)" width={560} onClose={closeModal}>
      <div style={{ fontSize: 12.5, color: C.slateSoft, marginBottom: 12 }}>
        Formato esperado por linha: <code>data, descrição, valor</code> (valores negativos = despesa).
        Exporte o CSV do seu banco e envie aqui.
      </div>
      <Field label="Arquivo CSV">
        <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={inputStyle} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Lançar na conta">
          <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <Field label="Categoria padrão">
          <Select value={defaultCat} onChange={(e) => setDefaultCat(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.parentId ? "— " : ""}{c.name}</option>
            ))}
          </Select>
        </Field>
      </div>
      {rows.length > 0 && (
        <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${C.line}`, borderRadius: 9, marginTop: 6 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 10px", borderBottom: `1px solid ${C.paperDim}` }}>
              <span>{r.date} · {r.description}</span>
              <span className="tabular" style={{ color: r.amount < 0 ? C.coral : C.emerald }}>{r.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11.5, color: C.slateSoft, marginTop: 8 }}>
        {rows.length} lançamento(s) detectado(s). Para faturas em PDF, exporte como CSV/OFX pelo app do banco antes de importar.
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
        <Button type="button" disabled={rows.length === 0 || createMany.isPending} onClick={confirm}>
          Importar {rows.length} lançamentos
        </Button>
      </div>
    </Modal>
  );
}
