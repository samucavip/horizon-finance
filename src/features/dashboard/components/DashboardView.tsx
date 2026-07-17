"use client";

import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip,
} from "recharts";
import { Card, EmptyHint, IconBadge, Loading, SectionTitle, StatCard } from "@/components/ui";
import { C } from "@/constants";
import {
  accountBalance, categorySpent, formatCurrency, monthExpense, monthIncome,
  monthTransactions, todayISO, topLevelCategories, totalInBRL, totalProjectedInBRL,
} from "@/utils";
import { useFinanceData } from "@/hooks";
import { useUiStore } from "@/stores/ui-store";

export function DashboardView() {
  const { accounts, categories, transactions, exchangeRate, isLoading } = useFinanceData();
  const month = useUiStore((s) => s.month);

  if (isLoading) return <Loading />;

  const today = todayISO();
  const monthTx = monthTransactions(transactions, month);
  const totalBalance = totalInBRL(accounts, transactions, exchangeRate, today);
  const totalProjected = totalProjectedInBRL(accounts, transactions, exchangeRate, month);
  const income = monthIncome(monthTx, accounts, exchangeRate);
  const expense = monthExpense(monthTx, accounts, exchangeRate);

  const pieData = topLevelCategories(categories)
    .map((c) => ({
      name: c.name,
      value: categorySpent(c.id, categories, monthTx, accounts, exchangeRate),
      color: c.color,
    }))
    .filter((d) => d.value > 0.01)
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 18 }}>
        <StatCard label="Saldo total hoje" value={formatCurrency(totalBalance, "BRL")} tone="ink" icon={Wallet} />
        <StatCard label="Saldo previsto (fim do mês)" value={formatCurrency(totalProjected, "BRL")} tone="steel" icon={TrendingUp} />
        <StatCard label="Entradas do mês" value={formatCurrency(income, "BRL")} tone="emerald" icon={TrendingUp} />
        <StatCard label="Saídas do mês" value={formatCurrency(expense, "BRL")} tone="coral" icon={TrendingDown} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card style={{ padding: 18 }}>
          <SectionTitle>Contas — saldo atual</SectionTitle>
          {accounts.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.paperDim}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <IconBadge
                  name={a.type === "credit" ? "CreditCard" : "Landmark"}
                  color={a.country === "BR" ? C.emerald : C.steel}
                  size={15}
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: C.slateSoft }}>{a.country} · {a.currency}</div>
                </div>
              </div>
              <div className="tabular" style={{ fontSize: 14, fontWeight: 600, color: accountBalance(a, transactions, today) < 0 ? C.coral : C.ink }}>
                {formatCurrency(accountBalance(a, transactions, today), a.currency)}
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 18 }}>
          <SectionTitle>Gastos por categoria (mês)</SectionTitle>
          {pieData.length === 0 ? (
            <EmptyHint text="Sem despesas lançadas neste mês ainda." />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v, "BRL")} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, minWidth: 0 }}>
                {pieData.slice(0, 6).map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.ink }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: d.color }} />{d.name}
                    </span>
                    <span className="tabular" style={{ color: C.slate }}>{formatCurrency(d.value, "BRL")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
