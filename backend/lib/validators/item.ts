import { z } from "zod";

// Espeja ItemRequest.java: @NotBlank name, @NotNull categoryId/statusId, el resto opcional.
export const itemSchema = z.object({
  name: z.string().min(1, "no debe estar vacío"),
  description: z.string().nullable().optional(),
  serialNumber: z.string().nullable().optional(),
  categoryId: z.number({ required_error: "es requerido" }),
  statusId: z.number({ required_error: "es requerido" }),
  responsibleId: z.number().nullable().optional(),
  acquisitionDate: z.string().nullable().optional(), // "yyyy-MM-dd"
  location: z.string().nullable().optional(),
  purchaseValue: z.number().nullable().optional(),
  observations: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  minStock: z.number().nullable().optional(),
});

export type ItemInput = z.infer<typeof itemSchema>;
