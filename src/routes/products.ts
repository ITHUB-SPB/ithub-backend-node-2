import { fileURLToPath } from 'url'
import { Router, type Request, type Response } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { products, getNextId, type Product } from "../data.js"
import validate from "../middleware/validate.js" 
import { formatSuccess, formatError } from "../middleware/format-result.js"
import { createProductSchema, putProductSchema, patchProductSchema } from "../schema.js"

export const productsRouter = Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../assets")
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  }),
  fileFilter: (req, file, cb) => {
    const isValid = ["image/jpeg", "image/png"].includes(file.mimetype)
    cb(null, isValid)
  },
  limits: { fileSize: 2 * 1024 * 1024 }
})

productsRouter.get("/", (req: Request, res: Response) => {
  let filtered = [...products]
  
  const category = req.query['category'] as string | undefined
  const minPrice = req.query['minPrice'] as string | undefined
  const maxPrice = req.query['maxPrice'] as string | undefined
  const page = Number(req.query['page']) || 1
  const limit = Number(req.query['limit']) || 10

  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice))
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice))
  }

  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  return formatSuccess(res, paginated, { total: filtered.length, page, limit })
})

productsRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const product = products.find(p => p.id === Number(req.params['id']))
  return product ? formatSuccess(res, product) : formatError(res, "Товар не найден", 404)
})

productsRouter.post("/", validate(createProductSchema, "body"), (req: Request, res: Response) => {
  const newProduct: Product = { 
    id: getNextId(), 
    createdAt: new Date().toISOString(), 
    ...req.body 
  }
  products.push(newProduct)
  return formatSuccess(res, newProduct, undefined, 201)
})

productsRouter.put("/:id", validate(putProductSchema, "body"), (req: Request<{ id: string }>, res: Response) => {
  const index = products.findIndex(p => p.id === Number(req.params['id']))
  if (index === -1) return formatError(res, "Товар не найден", 404)

  // Используем !, так как TypeScript не знает, что элемент существует (хотя мы проверили index)
  products[index] = { ...products[index]!, ...req.body, id: products[index]!.id }
  return formatSuccess(res, products[index]!)
})

productsRouter.patch("/:id", validate(patchProductSchema, "body"), (req: Request<{ id: string }>, res: Response) => {
  const index = products.findIndex(p => p.id === Number(req.params['id']))
  if (index === -1) return formatError(res, "Товар не найден", 404)

  products[index] = { ...products[index]!, ...req.body, id: products[index]!.id }
  return formatSuccess(res, products[index]!)
})

productsRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const index = products.findIndex(p => p.id === Number(req.params['id']))
  if (index === -1) return formatError(res, "Товар не найден", 404)
  
  products.splice(index, 1)
  return res.status(204).send()
})

productsRouter.post("/:id/image", upload.single("image"), (req: Request<{ id: string }>, res: Response) => {
  const index = products.findIndex(p => p.id === Number(req.params['id']))
  
  if (index === -1) {
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    return formatError(res, "Товар не найден", 404)
  }
  
  if (!req.file) {
    return formatError(res, "Файл не загружен или формат не JPEG/PNG", 400)
  }

  const imageUrl = `/static/${req.file.filename}`
  products[index] = { ...products[index]!, imageUrl }
  return formatSuccess(res, products[index]!)
})