import { Router, type Request, type Response } from "express";
import multer from "multer";

const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 2 }
})

export const mediaRouter = Router()

mediaRouter.get('/media', (request: Request, response: Response) => {
    response.json()
})

mediaRouter.post('/media/upload', (request: Request, response: Response) => {
    console.log(request.file)
    response.end()
})