import { Router } from "express"
import { users } from "../data.js"

export const usersRouter = Router()

usersRouter.get('/users', (request, response) => {
    const limit = request.query['limit'] || 20
    const offset = request.query['offset'] || 0

    response.json({
        users: users.slice(Number(offset), Number(offset) + Number(limit))
    })
})

usersRouter.post('/users', (request, response) => {
    users.push(request.body)

    response.status(201).json({
        message: `Пользователь ${request.body.username} создан`
    })
})

usersRouter.get('/users/:username', (request, response) => {
    response.json({
        user: users.find(
            u => u.username === request.params.username
        )
    })
})