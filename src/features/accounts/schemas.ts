import { z } from "zod";

export const accountFormSchema = z.object({
  name: z.string().min(1, "Informe o nome da conta"),
  country: z.enum(["BR", "US"]),
  currency: z.enum(["BRL", "USD", "EUR"]),
  type: z.enum(["checking", "savings", "credit"]),
  initialBalance: z.coerce.number(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
