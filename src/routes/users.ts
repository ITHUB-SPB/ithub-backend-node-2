import { Router, type Response } from "express"
import { users } from "../data.js"

// TODO: быть построже с типами formatSuccess
function formatSuccess(
    response: Response,
    data: { [k: string]: object },
    code: number
) {
    response.status(code).json({
        success: true,
        data
    })
}

// типизировать code либо через енам всех доступных кодов, 
// либо через суживание типа number до 4xx и 5xx
function formatError(
    response: Response,
    message: string,
    code: number = 400,
    details: object = {}
) {
    response.status(code).json({
        success: false,
        error: message,
        details
    })
}

export const usersRouter = Router()

usersRouter.get('/users', (request, response) => {
    const limit = Number(request.query['limit'] || 20)
    const offset = Number(request.query['offset'] || 0)

    const data = {
        users: users.slice(offset, offset + limit)
    }

    const meta = {
        total: users.length,
        page: Math.ceil(users.length / (limit + offset)), // TODO
        limit,
        pages: Math.ceil(users.length / limit)
    }

    formatSuccess(response, { ...data, meta }, 200)
})

usersRouter.post('/users', (request, response) => {
    users.push(request.body)

    const data = { user: users.at(-1)! }

    formatSuccess(response, data, 201)
})

usersRouter.get('/users/:username', (request, response) => {
    const user = users.find(
        u => u.username === request.params.username
    )

    if (!user) {
        formatError(response, "Пользователь не найден", 404)
        return
    }

    const data = {
        user
    }

    formatSuccess(response, data, 200)
})