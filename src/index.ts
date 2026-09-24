import express, { response } from 'express'
import { resolve } from 'path'
import * as z from "zod"
import { ru } from "zod/locales"
import { products } from "./data.js"

z.config(ru())

const app = express()

app.get('/api/products', (request, response) => {
    let result = products;

    const { category, minPrice, maxPrice, page, limit, offset } = request.query;

    if (category) {
        result = result.filter(p => p.category === String(category));
    }
    if (minPrice) {
        result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        result = result.filter(p => p.price <= Number(maxPrice));
    }

    const total = result.length;

    const limitNum = Number(limit) || 10;// кол-во товаров на странице (по умолчанию 10)
    let pageNum, offsetNum;

    if (offset) {
        offsetNum = Number(offset);
        pageNum = Math.floor(offsetNum / limitNum) + 1;
    } else {
        pageNum = Number(page) || 1;
        offsetNum = (pageNum - 1) * limitNum;
    }

    const paginated = result.slice(offsetNum, offsetNum + limitNum);

    response.json({ 
        data: paginated,
        total,
        page: pageNum,
        limit: limitNum
    });
})

// подключение раздачи статики по виртуальному пути /static из директории /assets
// TODO

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