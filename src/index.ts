import express from "express";
import * as z from "zod";
import { ru } from "zod/locales";
import productsRouter from "./routes/products.js";
import logger from "./middleware/logging.js";
import errorHandler from "./middleware/error-handling.js";

z.config(ru());

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/products', productsRouter);
app.get("/",(req,res)=>{
    res.send("work")
})


app.use(errorHandler)
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
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