import { z } from "zod";

// Espeja CatalogRequest.java — usado por categories y statuses.
export const catalogSchema = z.object({
  name: z.string().min(1, "no debe estar vacío"),
  description: z.string().nullable().optional(),
});

export type CatalogInput = z.infer<typeof catalogSchema>;
