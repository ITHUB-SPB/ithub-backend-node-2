import { Router } from "express";
import { products } from "../data.js";
import { createProductSchema, updateProductSchema } from "../schema.js";
export const productsRouter = Router();
import validate from "../middleware/validate.js";
import { formatSuccess,formatError } from "../middleware/format-result.js";

type RequestParsed = Request & {
  bodyParsed?: object;
  queryParsed?: object;
};

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

productsRouter.post("/", (req, res) => {
  const { name, price, stock, desc } = (req as any).bodyParsed;

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock: stock ?? 0,
    desc: desc,
  };

  products.push(newProduct);

  res.status(201).json({ data: newProduct });
});

productsRouter.get("/:id", (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: "нету" });
  }
  return res.json({ data: product });
});

productsRouter.put("/:id", (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);
  const productIx = products.findIndex((p) => p.id === productId);
  if (productIx === -1) {
    return res.status(404).json({ error: "нету" });
  }

  products[productIx] = {
    id: productId,
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    desc: req.body.desc,
  };

  return res.json({ data: products[productIx] });
});

productsRouter.patch("/:id", validate(updateProductSchema, "body"), (req, res) => {
  const productId = parseInt(req.params["id"] as string, 10);
  const product = products.find((p) => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: "нету" });
  }
  const dataToUpdate = (req as any).bodyParsed;
Object.assign(product, dataToUpdate);

  return res.json(formatSuccess(product));

});

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
// 1. используйте данные из src/data
// 2. используйте миддлвэа на валидацию по схемам
// 3. используйте форматирование ответов (formatSuccess и formatError из примера)
