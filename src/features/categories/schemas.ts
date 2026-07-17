import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Informe o nome da categoria"),
  color: z.string().min(1),
  icon: z.string().min(1),
  parentId: z.string(),
  budget: z.coerce.number().min(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
