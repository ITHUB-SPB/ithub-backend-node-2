import express from "express"
import * as z from "zod"
import { ru } from "zod/locales"
import { productsRouter } from "./routes/products.js"

z.config(ru())

const app = express()
const port = 3000

// подключение раздачи статики по виртуальному пути /static из директории /assets

app.use(express.json())

// самописный миддлвэа на логгирование
// TODO

app.use("/api/products", productsRouter)
app.get("/", (request, response) => {
    response.send("yay :3")
})

// подключение обработчика not-found запросов
// TODO

// подключение глобального error-миддлвэа
// TODO

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
