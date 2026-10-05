import { response, Router } from "express"
import { products } from "../data.js"
import { number, success } from "zod"
import { start } from "repl"
import { createProductSchema } from "../schema.js"
import validate from "../middleware/validate.js"
import { formatSuccess } from "../middleware/format-result.js"

export const productsRouter = Router()

productsRouter.get("/", (request, response) => {
    const { min_price, max_price, page, limit } = request.query
    const minPrice = min_price ? Number(min_price) : -Infinity
    const maxPrice = max_price ? Number(max_price) : Infinity
    const filteredProducts = products.filter(({ price }) => {
        return price >= minPrice && price <= maxPrice
    })
    const currentPage = Number(page) || 1
    const currentLimit = Number(limit) || 10
    const startIndex = (currentPage - 1) * currentLimit
    const endIndex = startIndex + currentLimit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    response.json({
        success: true,
        data: paginatedProducts,
        meta: {
            total: filteredProducts.length,
            page: currentPage,
            limit: currentLimit
        }
    })
})

productsRouter.post(
    "/",
    validate(createProductSchema, "body"),
    (request, response) => {
        const { name, price, stock, description, category } = request.body
        const newProduct = {
            id: products.length + 1,
            name: name,
            price: price,
            stock: stock ?? 0,
            description: description,
            category: category || "other",
            createdAt: new Date().toISOString()
        }
        products.push(newProduct)
        response.status(201).json(formatSuccess(newProduct))
    }
)

productsRouter.get("/:id", (request, response) => {
    const productId = Number(request.params["id"])
    const product = products.find(({ id }) => { return id === productId })
    if (!product) return response.status(404).json({ error: "Not found" })
    return response.json({ data: product })
})

// 1. используйте данные из src/data
// 2. используйте миддлвэа на валидацию по схемам
// 3. используйте форматирование ответов (formatSuccess и formatError из примера)
