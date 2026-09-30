import type { Response } from 'express'

export function formatSuccess(res: Response, data: unknown, status = 200, meta?: object): void {
    res.status(status).json({
        success: true,
        data,
        ...(meta && { meta }),
    })
}

export function formatError(res: Response, message: string, status = 400, details?: unknown): void {
    res.status(status).json({
        success: false,
        error: message,
        ...(details ? { details: details as object } : {}),
    })
}