import type { Request, Response, NextFunction } from 'express'

const logger = (request: Request, response: Response, next: NextFunction) => {
    const start = Date.now()

    response.on('finish', () => {
        const duration = Date.now() - start
        console.log(`${request.method} ${request.url} ${response.statusCode} ${duration}ms`)
    })

    next()
}

export default logger