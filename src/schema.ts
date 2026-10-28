import * as z from "zod"
import { Category } from "./data.js"

export const createProductSchema = z.strictObject({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  category: z.nativeEnum(Category),
  stock: z.number().int().min(0).default(0),
  description: z.string().max(500).optional()
})

export const putProductSchema = createProductSchema
export const patchProductSchema = createProductSchema.partial()