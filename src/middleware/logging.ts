import type { Request, Response, NextFunction } from 'express'

const logger = (request: Request, response: Response, next: NextFunction) => {
    const startTime = Date.now() 

    response.on('finish', () => {
        const duration = Date.now() - startTime

        console.log(
            `[${request.method}]`,
            request.url,
            `Status: ${response.statusCode}`,
            `-${duration} ms`   
        )
    })

    next()
}

export default logger