import { Router } from "express"
import { users } from "../data.js"
import auth from "../middleware/auth.js"

// TODO добавить возможность задать конкретную роль
import roles from "../middleware/roles.js"

import { formatSuccess, formatError } from "../lib/format-result.js"

export const usersRouter = Router()

usersRouter.get('/users', auth, roles, (request, response) => {
    const limit = Number(request.query['limit'] || 20)
    const offset = Number(request.query['offset'] || 0)

    const data = {
        users: users.slice(offset, offset + limit)
    }

    // limit = 5 offset 0 total 11
    // pages = 3
    // page = 1

    // limit = 5 offset 5 total 11
    // pages = 3
    // page = 2

    const meta = {
        total: users.length,
        page: Math.ceil(users.length / (offset)), // TODO найти закономерность
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

usersRouter.get('/users/:username', auth, (request, response) => {
    const user = users.find(
        u => u.username === request.params['username']
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