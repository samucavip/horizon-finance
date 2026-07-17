import { z } from "zod";
import { MAX_INSTALLMENTS } from "@/constants";

export const transactionFormSchema = z.object({
  description: z.string().min(1, "Informe uma descrição"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["expense", "income"]),
  accountId: z.string().min(1, "Selecione uma conta"),
  paymentMethod: z.enum(["debit", "credit"]),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  date: z.string().min(1, "Informe a data"),
  installments: z.coerce.number().int().min(1).max(MAX_INSTALLMENTS),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transferFormSchema = z
  .object({
    fromId: z.string().min(1, "Selecione a conta de origem"),
    toId: z.string().min(1, "Selecione a conta de destino"),
    fromAmount: z.coerce.number().positive("Valor deve ser maior que zero"),
    date: z.string().min(1, "Informe a data"),
  })
  .refine((v) => v.fromId !== v.toId, {
    message: "As contas devem ser diferentes",
    path: ["toId"],
  });

export type TransferFormValues = z.infer<typeof transferFormSchema>;
