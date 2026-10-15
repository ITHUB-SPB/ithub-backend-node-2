import * as z from "zod"
import type { Request, Response, NextFunction } from "express"

const errorHandler = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof z.ZodError) {
        response.status(422).json({
            success: false,
            error: z.flattenError(error)
        })
    } else {
        console.error(error)
        response.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export default errorHandler
