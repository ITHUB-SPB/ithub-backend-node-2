import express from 'express'
import type { Request, Response } from 'express'
import * as z from 'zod'
import { ru } from 'zod/locales'

import { productsRouter } from './routes/products.js'
import logger from './middleware/logging.js'
import errorHandler from './middleware/error-handling.js'
import { formatError } from './middleware/format-result.js'

z.config(ru())

const app = express()

// Раздача статики: /static → assets, /uploads → uploads (загруженные картинки)
app.use('/static', express.static('assets'))
app.use('/uploads', express.static('uploads'))

// Встроенные парсеры тела
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Кастомный логгер
app.use(logger)

// Health
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' })
})

// Роутер товаров
app.use('/api/products', productsRouter)

// 404 — после всех маршрутов
app.use((req: Request, res: Response) => {
    formatError(res, `Маршрут ${req.method} ${req.url} не найден`, 404)
})

// Error middleware — ВСЕГДА последним
app.use(errorHandler)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})