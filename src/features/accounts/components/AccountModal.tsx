"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, Modal, Select } from "@/components/ui";
import { ACCOUNT_TYPE_OPTIONS, COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "@/constants";
import { useUiStore } from "@/stores/ui-store";
import type { Account } from "@/types";
import { accountFormSchema, type AccountFormValues } from "../schemas";
import { useCreateAccount } from "../hooks/useAccounts";

export function AccountModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const createAccount = useCreateAccount();

  const {
    register, handleSubmit, setValue, formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "", country: "BR", currency: "BRL", type: "checking",
      initialBalance: "" as unknown as number,
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    // Credit-card defaults mirror the original prototype so cards render sanely.
    const isCredit = values.type === "credit";
    const account: Omit<Account, "id"> = {
      name: values.name,
      country: values.country,
      currency: values.currency,
      type: values.type,
      initialBalance: values.initialBalance || 0,
      closingDay: isCredit ? 20 : null,
      dueDay: isCredit ? 5 : null,
      limit: isCredit ? 5000 : null,
    };
    await createAccount.mutateAsync(account);
    closeModal();
  };

  return (
    <Modal title="Nova conta" onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nome" error={errors.name?.message}>
          <Input placeholder="Ex: Itaú" {...register("name")} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="País">
            <Select
              {...register("country", {
                onChange: (e) =>
                  setValue("currency", e.target.value === "BR" ? "BRL" : "USD"),
              })}
            >
              {COUNTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
          <Field label="Moeda">
            <Select {...register("currency")}>
              {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Tipo">
            <Select {...register("type")}>
              {ACCOUNT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
          <Field label="Saldo inicial" error={errors.initialBalance?.message}>
            <Input type="number" step="0.01" {...register("initialBalance")} />
          </Field>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
