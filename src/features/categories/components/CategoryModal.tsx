"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, Modal, Select } from "@/components/ui";
import { C, ICON_NAMES, ICONS } from "@/constants";
import { topLevelCategories } from "@/utils";
import { useCategories, useCreateCategory } from "../hooks/useCategories";
import { useUiStore } from "@/stores/ui-store";
import { categoryFormSchema, type CategoryFormValues } from "../schemas";
import type { Category } from "@/types";

export function CategoryModal() {
  const closeModal = useUiStore((s) => s.closeModal);
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const parents = topLevelCategories(categories);

  const {
    register, handleSubmit, control, watch, formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", color: C.steel, icon: "Receipt", parentId: "", budget: "" as unknown as number },
  });

  const parentId = watch("parentId");
  const color = watch("color");
  const isSubcategory = Boolean(parentId);

  const onSubmit = async (values: CategoryFormValues) => {
    const category: Omit<Category, "id"> = {
      name: values.name,
      color: values.color,
      icon: values.icon,
      parentId: values.parentId || null,
      budget: isSubcategory ? 0 : values.budget || 0,
    };
    await createCategory.mutateAsync(category);
    closeModal();
  };

  return (
    <Modal title="Nova categoria" onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nome" error={errors.name?.message}>
          <Input placeholder="Ex: Pets" {...register("name")} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Cor">
            <input
              type="color"
              {...register("color")}
              style={{ width: "100%", height: 38, border: `1px solid ${C.line}`, borderRadius: 9, padding: 2 }}
            />
          </Field>
          <Field label="Categoria pai (opcional)">
            <Select {...register("parentId")}>
              <option value="">Nenhuma (categoria principal)</option>
              {parents.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Ícone">
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 6 }}>
                {ICON_NAMES.map((n) => {
                  const Icon = ICONS[n];
                  const selected = field.value === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => field.onChange(n)}
                      aria-label={n}
                      style={{
                        border: selected ? `2px solid ${color}` : `1px solid ${C.line}`, borderRadius: 8, padding: 7,
                        background: selected ? color + "18" : C.white, cursor: "pointer",
                      }}
                    >
                      {Icon ? <Icon size={15} color={C.ink} /> : null}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Field>
        {!isSubcategory && (
          <Field label="Orçamento mensal (opcional)" error={errors.budget?.message}>
            <Input type="number" step="0.01" placeholder="0.00" {...register("budget")} />
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
