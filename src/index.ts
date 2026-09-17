import express, { type Request, type Response, type NextFunction } from 'express'
import { usersRouter } from './routes/users.js'

const app = express()

const loggerFn = (request: Request, response: Response, next: NextFunction) => {
    console.log(
        new Date().toLocaleDateString('ru'),
        request.url,
        request.params,
        request.body
    )
    next()
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(loggerFn)

app.use(usersRouter)

app.get('/', (_, response) => {
    response.end('ok')
})

app.use((_: Request, response: Response) => {
    response.status(404).json({
        message: "Ресурс не найден"
    })
})

app.use((
    error: Error,
    _: Request,
    response: Response,
    next: NextFunction
) => {
    console.error(error.stack)
    response.status(400).json({
        success: false,
        error: error.message
    })
    next()
})

app.listen(3000)