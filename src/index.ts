import express from 'express'
import * as z from "zod"
import { ru } from "zod/locales"
import path from 'path'
import { fileURLToPath } from 'url' 

import { productsRouter } from './routes/products.js'
import logger from './middleware/logging.js'
import errorHandler from './middleware/error-handling.js'

z.config(ru())

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, '../assets')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(logger)

app.use('/api/products', productsRouter)

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Маршрут не найден'
  })
})

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})