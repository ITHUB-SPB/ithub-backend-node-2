import * as z from "zod";

export const createProductSchema = z.strictObject({
  name: z.string(),
  price: z.number().positive().min(1),
  stock: z.number().int().min(0).default(0).optional(),
  desc: z.string().max(500).optional(),

});

export const updateProductSchema = createProductSchema.partial();

export const getProductSchema = z.strictObject({
  limit: z.optional(z.literal(["10", "25"]).transform(Number)).default(10),
  offset: z.optional(z.coerce.number().min(0).int()).default(0),
});
