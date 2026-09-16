import express, { type Request, type Response, type NextFunction } from 'express'

const app = express()

const users = ['maria', 'alexander', 'ivan']

const loggerFn = (request: Request, response: Response, next: NextFunction) => {
    console.log(new Date().toLocaleDateString('ru'), request.url, request.params)
    next()
}

app.get('/', (_, response) => {
    response.end('ok')
})

app.get('/users', loggerFn, (request, response) => {
    const limit = request.query['limit'] || 20
    const offset = request.query['offset'] || 0

    response.json({
        users: users.slice(Number(offset), Number(offset) + Number(limit))
    })
})


app.get('/users/:userId', (request, response) => {
    response.json({
        id: request.params.userId,
        user: 'alexander'
    })
})

app.listen(3000)