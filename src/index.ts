import express from "express"
import * as z from "zod"
import { ru } from "zod/locales"
import { productsRouter } from "./routes/products.js"
import logger from "./middleware/logging.js"
import errorHandler from "./middleware/error-handling.js"
import multer, { type FileFilterCallback } from "multer"
import path from "path"
import type { Request } from "express"

z.config(ru())

const app = express()
const port = 3000

// подключение раздачи статики по виртуальному пути /static из директории /assets
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        const uploadPath = path.join(__dirname, "..", "assets")
        callback(null, uploadPath)
    },
    filename: (request, file, callback) => {
        callback(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})

function imageFilter(
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
) {
    const allowedMimeTypes = ["image/jpeg", "image/png"]
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(new Error("Unknown file type. Please upload a JPEG or PNG"))
    }
}

const assets = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 0x20_0000 }
})

app.use(express.json())
app.use(logger)

app.use("/api/products", productsRouter)
app.get("/", (request, response) => {
    response.send("yay :3")
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
