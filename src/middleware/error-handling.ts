import type { Request, Response, NextFunction  } from "express"

const errorHandler = (
    error: Error,
    _: Request,
    response: Response,
    next: NextFunction
) => {
    console.error(error.stack)
    // TODO детальная информация только для флага DEBUG (переменные окружения)
    response.status(400).json({
        success: false,
        error: error.message
    })
    next()
}



export default errorHandler