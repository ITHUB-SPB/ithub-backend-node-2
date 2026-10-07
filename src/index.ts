import express from "express";
import { productsRouter } from "./routes/products.js";
import logger from "./middleware/logging.js";
import errorHandler from "./middleware/error-handling.js";

const app = express();

// JSON
app.use(express.json());

// x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Статика из assets
app.use("/static", express.static("assets"));

// Логирование всех запросов
app.use(logger);

// Роутер продуктов
app.use("/api/products", productsRouter);

// Если маршрут не найден
app.use((request, response) => {
    response.status(404).json({
        success: false,
        error: `Маршрут ${request.method} ${request.originalUrl} не найден`,
    });
});

// Глобальный обработчик ошибок
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});
