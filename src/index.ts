import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { resolve } from 'path'
import * as z from "zod"
import { ru } from "zod/locales"
import { products } from "./data.js"

z.config(ru())

const app = express()

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} | Статус: ${res.statusCode} | Время: ${duration}ms`);
    });
    next();
});

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string[];
}

function sendSuccess<T>(res: Response, data: T, status = 200): Response {
    return res.status(status).json({ success: true, data });
}

function sendError(res: Response, error: string, status = 400, details?: string[]): Response {
    return res.status(status).json({ success: false, error, details });
}

const productSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    price: z.number().positive("Цена должна быть больше 0"),
    category: z.string().min(1, "Категория обязательна"),
    stock: z.number().int().nonnegative("Количество не может быть отрицательным").default(0),
    description: z.string().optional().default(""),
    imageUrl: z.string().optional().default("")
})

const createProductSchema = productSchema;
const updateProductSchema = productSchema.partial();

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;

interface ProductQuery {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    offset?: string;
}

const validateBody = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errorMessages = result.error.issues.map(
                issue => `${issue.path.join('.')}: ${issue.message}`
            );
            sendError(res, "Ошибка валидации", 400, errorMessages);
            return;
        }
        req.body = result.data;
        next();
    };
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'assets/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Разрешены только форматы JPEG и PNG'));
        }
    }
});

app.use('/static', express.static(resolve('assets')));
app.use(express.json());

app.get('/api/products', (req: Request<{}, {}, {}, ProductQuery>, res: Response) => {
    let result = products;
    const { category, minPrice, maxPrice, page, limit, offset } = req.query;

    if (category) result = result.filter(p => p.category === category);
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

    const total = result.length;
    const limitNum = Number(limit) || 10;
    let pageNum: number, offsetNum: number;

    if (offset) {
        offsetNum = Number(offset);
        pageNum = Math.floor(offsetNum / limitNum) + 1;
    } else {
        pageNum = Number(page) || 1;
        offsetNum = (pageNum - 1) * limitNum;
    }

    const paginated = result.slice(offsetNum, offsetNum + limitNum);
    
    sendSuccess(res, { items: paginated, total, page: pageNum, limit: limitNum });
});

app.post('/api/products', upload.single('image'), validateBody(createProductSchema), (req: Request<{}, {}, CreateProductInput>, res: Response) => {
    const input = req.body;
    const file = (req as Request & { file?: Express.Multer.File }).file;
    const imageUrl = file ? `/static/${file.filename}` : (input.imageUrl || "");

    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...input,
        imageUrl
    };

    products.push(newProduct);
    sendSuccess(res, newProduct, 201);
});

app.put('/api/products/:id', validateBody(createProductSchema), (req: Request<{ id: string }, {}, CreateProductInput>, res: Response) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return sendError(res, "Товар не найден", 404);
    
    products[index] = { id, ...req.body };
    sendSuccess(res, products[index]);
});

app.patch('/api/products/:id', validateBody(updateProductSchema), (req: Request<{ id: string }, {}, UpdateProductInput>, res: Response) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return sendError(res, "Товар не найден", 404);

    products[index] = { ...products[index], ...req.body };
    sendSuccess(res, products[index]);
});

app.delete('/api/products/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return sendError(res, "Товар не найден", 404);

    products.splice(index, 1);
    sendSuccess(res, { message: "Товар успешно удален" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        return sendError(res, "Ошибка загрузки файла", 400, [err.message]);
    }
    sendError(res, err.message || "Внутренняя ошибка сервера", 500);
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});