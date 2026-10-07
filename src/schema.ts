import * as z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  category: z.enum(["electronics", "clothing", "food", "other"]),
  stock: z.number().int().min(0).default(0),
  description: z.string().max(500).optional(),
});

export const updateProductSchema = createProductSchema.partial();