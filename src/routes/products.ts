import { Router } from "express";
import { products } from "../data.js";
import { createProductSchema, updateProductSchema } from "../schema.js";
export const productsRouter = Router();
import validate from "../middleware/validate.js";
import { formatSuccess, formatError } from "../middleware/format-result.js";
import multer from "multer";

const upload = multer({
  dest: "assets/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 МБ
});

productsRouter.get("/", (req, res) => {
  const { min_price, max_price, page, limit } = req.query;
  let filteredProducts = [...products];

  if (min_price) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= Number(min_price),
    );
  }

  if (max_price) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= Number(max_price),
    );
  }

  const total = filteredProducts.length;
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = startIndex + currentLimit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedProducts,
    meta: {
      total,
      page: currentPage,
      limit: currentLimit,
    },
  });
});

productsRouter.post("/", validate(createProductSchema, "body"), (req, res) => {
  const { name, price, stock, desc, category } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock: stock ?? 0,
    desc: desc,
    category: category || "other",
    createdAt: new Date().toISOString(), //текущая дата в строковом формате
  };

  products.push(newProduct);

  res.status(201).json(formatSuccess(newProduct));
});

productsRouter.post("/:id/image", upload.single("image"), (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json(formatError("не нашел товар"));
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json(formatError("нет картинки"));
  }

  product.imageUrl = `/assets/${file.filename}`;

  return res.json(formatSuccess(product));
});

productsRouter.get("/:id", (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json(formatError(`Товар с ID ${productId} не найден`));
  }

  return res.json(formatSuccess(product));
});

productsRouter.put("/:id", validate(createProductSchema, "body"), (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);
  const productIx = products.findIndex((p) => p.id === productId);

  if (productIx === -1) {
    return res.status(404).json(formatError(`Товар с ID ${productId} не найден`));
  }

    const oldProduct = products[productIx]!;

    const { name, price, stock, desc, category } =
      (req as any).bodyParsed || {};

    products[productIx] = {
      id: productId,
      name,
      price,
      stock: stock ?? 0,
      desc,
      category,
      createdAt: oldProduct.createdAt,
      imageUrl: oldProduct.imageUrl ?? "",
    };

    return res.json(formatSuccess(products[productIx]));
  },
);

productsRouter.patch(
  "/:id",
  validate(updateProductSchema, "body"),
  (req, res) => {
    const productId = parseInt(req.params["id"] as string, 10);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: "нету" });
    }
    const dataToUpdate = (req as any).bodyParsed;
    Object.assign(product, dataToUpdate);

    return res.json(formatSuccess(product));
  },
);

productsRouter.delete("/:id", (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: "нету" });
  }

  products.splice(productIndex, 1);

  return res.status(200).json({ message: "удалил" });
});

export default productsRouter;