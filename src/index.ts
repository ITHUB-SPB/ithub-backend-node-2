import express from 'express'
import * as z from "zod"
import { ru } from "zod/locales"
import { products } from './data.js'
import { error } from 'console'

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

    const { id, name, price, category, stock, description, imageUrl} = request.body

    if (!id || !name || price === undefined || !category || !stock || !description || !imageUrl) {
    return response.status(400).json({error: "PUT требует все поля: id, name, price, category, stock, description, imageUrl, createdAt"})
    }
    const index = products.findIndex(u => u.id === pr_id)

   if (index === -1) {
    return response.status(404).json({error: `Пользователь с ID ${pr_id} не найден`})
  }

  products[index] = { id: pr_id, name, price, category, stock, description, imageUrl, createdAt: products[index].createdAt }
  response.json( products[index])

})

app.patch('/api/products/:id', (request, response) => {
    const id = parseInt(request.params.id, 10)
    const index = products.findIndex(u => u.id === id)

    if (index === -1) {
        return response.status(404).json({error: `Пользователь с ID ${id} не найден`})
    }

    const allowedFields = ['price', 'stock', 'imageUrl']
    const updates = {}

    allowedFields.forEach(field => {
        if (request.body[field] !== undefined) {
            updates[field] = request.body[field]
        }
    })

    if (Object.keys(updates).length === 0) {
        return response.status(404).json({error: 'Нет допустимых полей для обновления'})
    }

    products[index] = { ...products[index], ...updates }
    response.json(products[index])
})

app.delete('/api/products/:id', (request, response) => {
    const id = parseInt(request.params.id, 10)
    const index = products.findIndex(u => u.id === id)

    if (index === -1) {
        return response.status(404).json({error: `Пользователь с ID ${id} не найден`})
    }

    products.splice(index, 1)

    response.status(204).send()
})

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