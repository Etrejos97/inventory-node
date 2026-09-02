import { z } from "zod";

// Espeja ResponsibleRequest.java
export const responsibleSchema = z.object({
  fullName: z.string().min(1, "no debe estar vacío"),
  position: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export type ResponsibleInput = z.infer<typeof responsibleSchema>;
