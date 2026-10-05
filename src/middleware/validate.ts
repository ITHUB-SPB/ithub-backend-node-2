import type { Request, Response, NextFunction } from "express"
import * as z from "zod"

type Kind = "body" | "query"

export default function validate(schema: z.ZodType, kind: Kind) {
    return (request: Request, _: Response, next: NextFunction) => {
        const result = schema.safeParse(request[kind])
        if (result.error) throw result.error
        next()
    }
}
