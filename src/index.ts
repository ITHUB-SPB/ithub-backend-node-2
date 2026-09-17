import express, { type Request, type Response } from 'express'

import logger from './middleware/logging.js'
import errorHandler from './middleware/error-handling.js'
import { usersRouter } from './routes/users.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

app.use(usersRouter)

app.get('/', (_, response) => {
    response.end('ok')
})

app.use((_: Request, response: Response) => {
    response.status(404).json({
        message: "Ресурс не найден"
    })
})

app.use(errorHandler)

app.listen(3000)