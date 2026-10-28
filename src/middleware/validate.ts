import type { Request, Response, NextFunction } from 'express'
import * as z from 'zod'
import { formatError } from './format-result.js'

type Kind = "body" | "query"

export default function validate(schema: z.ZodType<any>, kind: Kind = "body") {
  return async (request: Request, res: Response, next: NextFunction) => {
    try {
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((e: z.ZodIssue) => ({
          field: e.path.join('.'),
          message: e.message
        }))
        return formatError(res, 'Ошибка валидации данных', 400, formattedErrors)
      }
      next(error)
    }
  }
}