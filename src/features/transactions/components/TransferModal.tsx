"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, Modal, Select } from "@/components/ui";
import { C } from "@/constants";
import { formatCurrency, todayISO, transferRate } from "@/utils";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { useSettings } from "@/features/settings";
import { useUiStore } from "@/stores/ui-store";
import { transferFormSchema, type TransferFormValues } from "../schemas";
import { useCreateTransfer } from "../hooks/useTransfer";

export function TransferModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { data: accounts = [] } = useAccounts();
  const { exchangeRate } = useSettings();
  const createTransfer = useCreateTransfer();

  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromId: accounts[0]?.id ?? "",
      toId: accounts[1]?.id ?? "",
      fromAmount: "" as unknown as number,
      date: todayISO(),
    },
  });

  const fromId = watch("fromId");
  const toId = watch("toId");
  const fromAmount = watch("fromAmount");

  const from = accounts.find((a) => a.id === fromId);
  const to = accounts.find((a) => a.id === toId);
  const rate = from && to ? transferRate(from.currency, to.currency, exchangeRate) : 1;
  const toAmount = (Number(fromAmount) || 0) * rate;

  const onSubmit = async (values: TransferFormValues) => {
    await createTransfer.mutateAsync({
      input: { ...values, toAmount },
      accounts,
    });
    closeModal();
  };

  return (
    <Modal title="Transferência entre contas" onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="De" error={errors.fromId?.message}>
            <Select {...register("fromId")}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </Select>
          </Field>
          <Field label="Para" error={errors.toId?.message}>
            <Select {...register("toId")}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </Select>
          </Field>
        </div>
        <Field label={`Valor enviado (${from?.currency ?? ""})`} error={errors.fromAmount?.message}>
          <Input type="number" step="0.01" {...register("fromAmount")} />
        </Field>
        {from && to && from.currency !== to.currency && (
          <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 12 }}>
            Recebido em {to.currency}:{" "}
            <strong className="tabular">{formatCurrency(toAmount, to.currency)}</strong>{" "}
            (câmbio {rate.toFixed(4)})
          </div>
        )}
        <Field label="Data" error={errors.date?.message}>
          <Input type="date" {...register("date")} />
        </Field>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>Transferir</Button>
        </div>
      </form>
    </Modal>
  );
}
