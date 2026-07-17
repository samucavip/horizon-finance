"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button, Card, IconBadge, Loading } from "@/components/ui";
import { C } from "@/constants";
import { formatCurrency, topLevelCategories } from "@/utils";
import { useUiStore } from "@/stores/ui-store";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";

export function CategoriesView() {
  const { data: categories = [], isLoading } = useCategories();
  const openModal = useUiStore((s) => s.openModal);
  const deleteCategory = useDeleteCategory();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  if (isLoading) return <Loading />;

  const parents = topLevelCategories(categories);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button variant="ghost" onClick={() => openModal("category")}>
          <Plus size={14} />Nova categoria
        </Button>
      </div>
      <Card style={{ padding: 6 }}>
        {parents.map((cat) => {
          const children = categories.filter((c) => c.parentId === cat.id);
          const isOpen = open[cat.id];
          return (
            <div key={cat.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderBottom: `1px solid ${C.paperDim}` }}>
                {children.length > 0 ? (
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [cat.id]: !o[cat.id] }))}
                    aria-label={isOpen ? "Recolher" : "Expandir"}
                    style={iconBtn}
                  >
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>
                ) : (
                  <span style={{ width: 15 }} />
                )}
                <IconBadge name={cat.icon} color={cat.color} size={15} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, flex: 1 }}>{cat.name}</span>
                {cat.budget > 0 && (
                  <span className="tabular" style={{ fontSize: 11.5, color: C.slateSoft }}>
                    orçamento {formatCurrency(cat.budget, "BRL")}
                  </span>
                )}
                <button onClick={() => deleteCategory.mutate(cat.id)} aria-label="Excluir" style={iconBtn}>
                  <Trash2 size={14} />
                </button>
              </div>
              {isOpen && children.map((sub) => (
                <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px 8px 40px", borderBottom: `1px solid ${C.paperDim}`, background: C.paper }}>
                  <IconBadge name={sub.icon} color={sub.color} size={13} />
                  <span style={{ fontSize: 12.5, color: C.ink, flex: 1 }}>{sub.name}</span>
                  <button onClick={() => deleteCategory.mutate(sub.id)} aria-label="Excluir" style={iconBtn}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", color: C.slate,
};
