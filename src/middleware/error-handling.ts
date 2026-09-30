import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'

interface HttpError extends Error {
    status?: number
}

const errorHandler = (
    error: HttpError,
    _request: Request,
    response: Response,
    _next: NextFunction
) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        response.status(400).json({ success: false, error: 'Файл больше 2 МБ' })
        return
    }

    const status = error.status ?? 500
    const message = error.message || 'Внутренняя ошибка сервера'

    console.error(`[ERROR] ${status} ${message}`)

    response.status(status).json({
        success: false,
        error: message,
    })
}

export default errorHandler