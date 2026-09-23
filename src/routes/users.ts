import { Router, type Request } from "express"
import * as z from "zod"
import { ru } from "zod/locales"

import { users } from "../data.js"
import { createUserSchema, getUsersSchema } from '../schema.js'

import auth from "../middleware/auth.js"
// TODO добавить возможность задать конкретную роль
import roles from "../middleware/roles.js"
import validate from "../middleware/validate.js"

import { formatSuccess, formatError } from "../lib/format-result.js"

z.config(ru())

export const usersRouter = Router()

type RequestParsed = Request & {
    bodyParsed?: object
    queryParsed?: object
}

usersRouter.get('/users', auth, roles, validate(getUsersSchema, 'query'), (request: RequestParsed, response) => {
    const data = {
        users: users.slice(
            request.queryParsed.offset,
            request.queryParsed.offset + request.queryParsed.limit
        )
    }

    const meta = {
        total: users.length,
        // page: TODO найти закономерность
        limit: request.queryParsed.limit,
        pages: Math.ceil(users.length / request.queryParsed.limit)
    }

    formatSuccess(response, { ...data, meta }, 200)
})

usersRouter.post('/users', (request, response) => {
    const newUser = z.parse(createUserSchema, request.body)

    users.push(newUser)
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