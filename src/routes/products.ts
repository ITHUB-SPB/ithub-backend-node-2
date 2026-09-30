import { Router } from 'express'
import type { Request, Response } from 'express'

import { products, getNextId } from '../data.js'
import type { Product } from '../types.js'
import {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
} from '../schema.js'
import validate from '../middleware/validate.js'
import upload from '../middleware/upload.js'
import { formatSuccess, formatError } from '../middleware/format-result.js'

export const productsRouter = Router()

// GET /api/products
productsRouter.get('/', validate(productQuerySchema, 'query'), (_req: Request, res: Response) => {
    const query = res.locals['query'] as {
        category?: string
        minPrice?: number
        maxPrice?: number
        page: number
        limit: number
    }

    let result = [...products]

    if (query.category) {
        result = result.filter(p => p.category === query.category)
    }
    if (query.minPrice !== undefined) {
        result = result.filter(p => p.price >= query.minPrice!)
    }
    if (query.maxPrice !== undefined) {
        result = result.filter(p => p.price <= query.maxPrice!)
    }

    const total = result.length
    const start = (query.page - 1) * query.limit
    const paginated = result.slice(start, start + query.limit)

    formatSuccess(res, paginated, 200, {
        total,
        page: query.page,
        limit: query.limit,
        pages: Math.ceil(total / query.limit),
    })
})

// GET /api/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params['id'])

    if (!Number.isInteger(id)) {
        formatError(res, 'ID должен быть числом', 400)
        return
    }

    const product = products.find(p => p.id === id)

    if (!product) {
        formatError(res, `Товар с ID ${id} не найден`, 404)
        return
    }

    formatSuccess(res, product)
})

// POST /api/products
productsRouter.post('/', validate(createProductSchema, 'body'), (req: Request, res: Response) => {
    const body = req.body as {
        name: string
        price: number
        category: string
        stock: number
        description?: string
    }

    const product: Product = {
        id: getNextId(),
        name: body.name,
        price: body.price,
        category: body.category,
        stock: body.stock,
        createdAt: new Date().toISOString(),
    }

    if (body.description !== undefined) {
        product.description = body.description
    }

    products.push(product)
    formatSuccess(res, product, 201)
})

// PUT /api/products/:id
productsRouter.put('/:id', validate(createProductSchema, 'body'), (req: Request, res: Response) => {
    const id = Number(req.params['id'])

    if (!Number.isInteger(id)) {
        formatError(res, 'ID должен быть числом', 400)
        return
    }

    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        formatError(res, `Товар с ID ${id} не найден`, 404)
        return
    }

    const body = req.body as {
        name: string
        price: number
        category: string
        stock: number
        description?: string
    }

    const existing = products[index]!
    const updated: Product = {
        id: existing.id,
        name: body.name,
        price: body.price,
        category: body.category,
        stock: body.stock,
        createdAt: existing.createdAt,
    }

    if (existing.imageUrl !== undefined) {
        updated.imageUrl = existing.imageUrl
    }
    if (body.description !== undefined) {
        updated.description = body.description
    }

    products[index] = updated
    formatSuccess(res, updated)
})

// PATCH /api/products/:id
productsRouter.patch('/:id', validate(updateProductSchema, 'body'), (req: Request, res: Response) => {
    const id = Number(req.params['id'])

    if (!Number.isInteger(id)) {
        formatError(res, 'ID должен быть числом', 400)
        return
    }

    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        formatError(res, `Товар с ID ${id} не найден`, 404)
        return
    }

    const existing = products[index]!
    const body = req.body as Partial<{
        name: string
        price: number
        category: string
        stock: number
        description: string
    }>

    const updated: Product = { ...existing }

    if (body.name !== undefined) updated.name = body.name
    if (body.price !== undefined) updated.price = body.price
    if (body.category !== undefined) updated.category = body.category
    if (body.stock !== undefined) updated.stock = body.stock
    if (body.description !== undefined) updated.description = body.description

    products[index] = updated
    formatSuccess(res, updated)
})

// DELETE /api/products/:id
productsRouter.delete('/:id', (req: Request, res: Response) => {
    const id = Number(req.params['id'])

    if (!Number.isInteger(id)) {
        formatError(res, 'ID должен быть числом', 400)
        return
    }

    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        formatError(res, `Товар с ID ${id} не найден`, 404)
        return
    }

    products.splice(index, 1)
    res.status(204).send()
})

// POST /api/products/:id/image
productsRouter.post('/:id/image', upload.single('image'), (req: Request, res: Response) => {
    const id = Number(req.params['id'])

    if (!Number.isInteger(id)) {
        formatError(res, 'ID должен быть числом', 400)
        return
    }

    const product = products.find(p => p.id === id)

    if (!product) {
        formatError(res, `Товар с ID ${id} не найден`, 404)
        return
    }

    if (!req.file) {
        formatError(res, 'Файл не загружен', 400)
        return
    }

    product.imageUrl = `/uploads/${req.file.filename}`
    formatSuccess(res, product)
})