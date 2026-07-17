import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
