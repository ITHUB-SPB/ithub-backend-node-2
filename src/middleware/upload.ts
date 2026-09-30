import multer from 'multer'
import path from 'path'
import fs from 'fs'

fs.mkdirSync('uploads', { recursive: true })

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname).toLowerCase())
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png']
        if (!allowed.includes(file.mimetype)) {
            cb(new Error('Только JPEG и PNG'))
            return
        }
        cb(null, true)
    },
})

export default upload