import * as z from "zod"

export const ProductSchema = z.object({
  id: z.number().int().positive(), 
  name: z.string()
    .min(2, { message: "Название должно содержать минимум 2 символа" })
    .max(100, { message: "Название не должно превышать 100 символов" }),
  price: z.number()
    .positive({ message: "Цена должна быть больше 0" }),
  category: z.enum(['electronics', 'clothing', 'food', 'other'], {
    errorMap: () => ({ message: "Категория должна быть одной из: electronics, clothing, food, other" })
  }),
  stock: z.number()
    .int({ message: "Количество должно быть целым числом" })
    .min(0, { message: "Количество не может быть отрицательным" })
    .default(0),
  
  description: z.string()
    .max(500, { message: "Описание не должно превышать 500 символов" })
    .or(z.literal(''))
    .optional(),
  
  imageUrl: z.string()
    .regex(/^https?:\/\/.+/, { message: "Некорректный формат ссылки для изображения" })
    .or(z.literal(''))
    .optional(),
    
  createdAt: z.string().optional()
});
// export const getUsersSchema = z.strictObject({})