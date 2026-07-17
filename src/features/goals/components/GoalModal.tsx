"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, Modal } from "@/components/ui";
import { C } from "@/constants";
import { useUiStore } from "@/stores/ui-store";
import type { Goal } from "@/types";
import { goalFormSchema, type GoalFormValues } from "../schemas";
import { useCreateGoal } from "../hooks/useGoals";

export function GoalModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const createGoal = useCreateGoal();

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "", target: "" as unknown as number, current: "" as unknown as number, color: C.emerald,
    },
  });

  const onSubmit = async (values: GoalFormValues) => {
    const goal: Omit<Goal, "id"> = {
      name: values.name,
      target: values.target,
      current: values.current || 0,
      color: values.color,
      deadline: "",
    };
    await createGoal.mutateAsync(goal);
    closeModal();
  };

  return (
    <Modal title="Nova meta" onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nome" error={errors.name?.message}>
          <Input placeholder="Ex: Carro novo" {...register("name")} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Valor alvo" error={errors.target?.message}>
            <Input type="number" step="0.01" {...register("target")} />
          </Field>
          <Field label="Valor atual" error={errors.current?.message}>
            <Input type="number" step="0.01" {...register("current")} />
          </Field>
        </div>
        <Field label="Cor">
          <input
            type="color"
            {...register("color")}
            style={{ width: "100%", height: 38, border: `1px solid ${C.line}`, borderRadius: 9, padding: 2 }}
          />
        </Field>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
