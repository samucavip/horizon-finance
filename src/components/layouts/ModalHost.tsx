"use client";

import { useUiStore } from "@/stores/ui-store";
import { AccountModal } from "@/features/accounts";
import { CategoryModal } from "@/features/categories";
import { GoalModal } from "@/features/goals";
import { ImportModal, TransactionModal, TransferModal } from "@/features/transactions";

// Renders whichever modal the UI store has open. Keyed by the active modal so
// each opens with fresh form state.
export function ModalHost() {
  const activeModal = useUiStore((s) => s.activeModal);
  if (!activeModal) return null;

  switch (activeModal) {
    case "transaction":
      return <TransactionModal />;
    case "account":
      return <AccountModal />;
    case "category":
      return <CategoryModal />;
    case "goal":
      return <GoalModal />;
    case "transfer":
      return <TransferModal />;
    case "import":
      return <ImportModal />;
    default:
      return null;
  }
}
