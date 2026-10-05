import * as z from "zod"

export const createProductSchema = z.strictObject({
    name: z.string(),
    price: z.number().positive().min(1),
    stock: z.number().int().min(0).default(0).optional(),
    description: z.string().max(500).optional(),
    category: z.enum(["electronics", "clothing", "food", "other"])
})

export const updateProductSchema = createProductSchema.partial()

export const getProductSchema = z.strictObject({
    // TODO
})
