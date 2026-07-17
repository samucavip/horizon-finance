"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, Modal, Select } from "@/components/ui";
import {
  PAYMENT_METHOD_OPTIONS, TRANSACTION_TYPE_OPTIONS,
} from "@/constants";
import { addMonths, todayISO } from "@/utils";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useUiStore } from "@/stores/ui-store";
import type { Transaction } from "@/types";
import { transactionFormSchema, type TransactionFormValues } from "../schemas";
import {
  useCreateTransaction, useCreateTransactions, useUpdateTransaction,
} from "../hooks/useTransactions";

export function TransactionModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const editing = useUiStore((s) => s.editingTransaction);

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();

  const createTx = useCreateTransaction();
  const createMany = useCreateTransactions();
  const updateTx = useUpdateTransaction();

  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: editing?.description ?? "",
      amount: editing ? Math.abs(editing.amount) : ("" as unknown as number),
      type: editing?.type === "income" ? "income" : "expense",
      accountId: editing?.accountId ?? accounts[0]?.id ?? "",
      paymentMethod: editing?.paymentMethod ?? "debit",
      categoryId: editing?.categoryId ?? categories.find((c) => !c.parentId)?.id ?? "",
      date: editing?.date ?? todayISO(),
      installments: 1,
    },
  });

  const type = watch("type");
  const paymentMethod = watch("paymentMethod");
  const showInstallments = paymentMethod === "credit" && type === "expense" && !editing;

  const onSubmit = async (values: TransactionFormValues) => {
    const signed = values.type === "expense" ? -Math.abs(values.amount) : Math.abs(values.amount);

    if (showInstallments && values.installments > 1) {
      const rows: Omit<Transaction, "id">[] = Array.from({ length: values.installments }, (_, i) => ({
        accountId: values.accountId,
        date: addMonths(values.date, i),
        description: `${values.description} (${i + 1}/${values.installments})`,
        amount: -Math.abs(values.amount) / values.installments,
        categoryId: values.categoryId,
        type: "expense",
        paymentMethod: "credit",
      }));
      await createMany.mutateAsync(rows);
      closeModal();
      return;
    }

    const payload: Omit<Transaction, "id"> = {
      accountId: values.accountId,
      description: values.description,
      amount: signed,
      categoryId: values.categoryId,
      type: values.type,
      date: values.date,
      paymentMethod: values.paymentMethod,
    };

    if (editing) {
      await updateTx.mutateAsync({ id: editing.id, tx: payload });
    } else {
      await createTx.mutateAsync(payload);
    }
    closeModal();
  };

  return (
    <Modal title={editing ? "Editar lançamento" : "Novo lançamento"} onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Descrição" error={errors.description?.message}>
          <Input placeholder="Ex: Supermercado" {...register("description")} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Valor" error={errors.amount?.message}>
            <Input type="number" step="0.01" {...register("amount")} />
          </Field>
          <Field label="Tipo">
            <Select {...register("type")}>
              {TRANSACTION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Conta" error={errors.accountId?.message}>
            <Select {...register("accountId")}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
          </Field>
          <Field label="Forma de pagamento">
            <Select {...register("paymentMethod")}>
              {PAYMENT_METHOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Categoria" error={errors.categoryId?.message}>
            <Select {...register("categoryId")}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.parentId ? "— " : ""}{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Data" error={errors.date?.message}>
            <Input type="date" {...register("date")} />
          </Field>
        </div>
        {showInstallments && (
          <Field label="Parcelas" error={errors.installments?.message}>
            <Input type="number" min={1} max={24} {...register("installments")} />
          </Field>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
