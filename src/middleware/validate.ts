import type { Request, Response, NextFunction } from 'express'
import * as z from 'zod'

type Kind = "body" | "query"

export default function validate(schema: z.ZodType, kind: Kind) {
    return (request: Request, res: Response, next: NextFunction) => {
        const data = kind === 'body' ? request.body : request.query

        const result = schema.safeParse(data)

        if (!result.success) {
            res.status(400).json({
                success: false,
                error: 'Ошибка валидации',
                details: result.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            })
            return
        }

        if (kind === 'body') {
            request.body = result.data
        } else {
            res.locals['query'] = result.data
        }

        next()
    }
}