import * as z from "zod"

export const createProductSchema = z.strictObject({
  name: z.string().min(2, 'Имя должно быть минимум 2 символа').max(100, 'Имя должно быть максимум 100 символов'),
  price: z.number().positive('Цена должна быть больше 0'),
  category: z.enum(['electronics', 'clothing', 'food', 'other'], { message: 'Неверная категория' }),
  stock: z.number().int('Stock должен быть целым числом').nonnegative('Stock не может быть отрицательным').default(0),
  description: z.string().max(500, 'Описание максимум 500 символов').optional(),
})

export const updateProductSchema = z.strictObject({
  name: z.string().min(2, 'Имя должно быть минимум 2 символа').max(100).optional(),
  price: z.number().positive('Цена должна быть больше 0').optional(),
  category: z.enum(['electronics', 'clothing', 'food', 'other'], { message: 'Неверная категория' }).optional(),
  stock: z.number().int('Stock должен быть целым числом').nonnegative('Stock не может быть отрицательным').optional(),
  description: z.string().max(500, 'Описание максимум 500 символов').optional(),
}).refine(
  data => Object.keys(data).length > 0,
  { message: 'Нужно передать хотя бы одно поле для обновления' }
)

export const productQuerySchema = z.strictObject({
  category: z.enum(['electronics', 'clothing', 'food', 'other'], { message: 'Неверная категория' }).optional(),
  minPrice: z.coerce.number().nonnegative('minPrice не может быть отрицательным').optional(),
  maxPrice: z.coerce.number().nonnegative('maxPrice не может быть отрицательным').optional(),
  page: z.coerce.number().int().min(1, 'page минимум 1').default(1),
  limit: z.coerce.number().int().min(1, 'limit минимум 1').max(100, 'limit максимум 100').default(10),
})