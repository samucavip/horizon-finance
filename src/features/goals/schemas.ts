import { z } from "zod";

export const goalFormSchema = z.object({
  name: z.string().min(1, "Informe o nome da meta"),
  target: z.coerce.number().positive("Valor alvo deve ser maior que zero"),
  current: z.coerce.number().min(0),
  color: z.string().min(1),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
