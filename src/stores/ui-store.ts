import { create } from "zustand";
import { currentMonthKey } from "@/utils";
import type { Transaction } from "@/types";

export type ModalType =
  | "transaction"
  | "account"
  | "category"
  | "goal"
  | "transfer"
  | "import";

interface UiState {
  // Selected month (YYYY-MM) — UI state shared across every data view.
  month: string;
  setMonth: (month: string) => void;

  // Which modal is open, plus the transaction being edited (if any).
  activeModal: ModalType | null;
  editingTransaction: Transaction | null;
  openModal: (modal: ModalType) => void;
  openTransactionModal: (editing?: Transaction | null) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  month: currentMonthKey(),
  setMonth: (month) => set({ month }),

  activeModal: null,
  editingTransaction: null,
  openModal: (modal) => set({ activeModal: modal, editingTransaction: null }),
  openTransactionModal: (editing = null) =>
    set({ activeModal: "transaction", editingTransaction: editing }),
  closeModal: () => set({ activeModal: null, editingTransaction: null }),
}));
