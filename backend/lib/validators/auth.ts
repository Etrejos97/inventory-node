import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "no debe estar vacío"),
  password: z.string().min(1, "no debe estar vacío"),
});

export type LoginInput = z.infer<typeof loginSchema>;
