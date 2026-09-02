import { z } from "zod";

// Espeja UserRequest.java
export const userSchema = z.object({
  username: z.string().min(1, "no debe estar vacío"),
  password: z.string().nullable().optional(),
  fullName: z.string().min(1, "no debe estar vacío"),
  email: z.string().nullable().optional(),
  roleId: z.number().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
