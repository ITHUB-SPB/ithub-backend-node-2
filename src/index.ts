import express from 'express'
import * as z from "zod"
import { ru } from "zod/locales"
import { products } from './data.js'

z.config(ru())

const app = express()

app.use(express.json())

app.get('/api/products', (request, response) => {
    const limit = Number(request.query['limit'] || 20)
    const offset = Number(request.query['offset'] || 0)
    const category = request.query['category']
    const minPrice = Number(request.query['minPrice'])
    const maxPrice = Number(request.query['maxPrice'])

    let filteredProducts = products.filter(product => {
        if (category !== undefined && product.category !== category) {
            return false
        }

        if (!isNaN(minPrice) && product.price < minPrice) {
            return false
        }

        if (!isNaN(maxPrice) && product.price > maxPrice) {
            return false
        }

        return true
    })

    const meta = {
        total: filteredProducts.length,
        limit,
        offset
    }

    response.json({data: filteredProducts.slice(offset, offset + limit), meta: meta})
})

app.post('/api/products', (request, response) => {
    products.push(request.body)

    const data = { products: products.at(-1)! }

    response.json(data)
})

app.put('/api/products/:id', (request, response) => {
    const pr_id = parseInt(request.params.id, 10)

    const { id, name, price, category, stock, description, imageUrl, createdAt } = request.body

    if (!id || !name || !price || !category || !stock || !description || !imageUrl || !createdAt === undefined) {
    return errorResponse(res, 'PUT требует все поля: name, email, age', 400)
    }
    const index = products.findIndex(u => u.id === id)

    response.end('ok')
})

// app.patch('/api/products', (request, response) => {
//     response.end('ok')
// })

// app.delete('/api/products', (request, response) => {
//     response.end('ok')
// })

// app.post('/api/products', (request, response) => {
//     response.end('ok')
// })
// подключение раздачи статики по виртуальному пути /static из директории /assets

// встроенные глобальные миддлвэа на парсинг тел в json и x-www-form-urlencoded
// TODO
// TODO

// самописный миддлвэа на логгирование
// TODO

// подключение роутера продуктов
// TODO

// подключение обработчика not-found запросов
// TODO

// подключение глобального error-миддлвэа
// TODO

app.listen(3000)