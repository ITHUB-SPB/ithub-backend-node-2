import express, { response } from 'express'
import { resolve } from 'path'
import * as z from "zod"
import { ru } from "zod/locales"
import { products } from "./data.js"

z.config(ru())

const app = express()
app.get('/api/products', (_, response) => {
    response.json(products)
})

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