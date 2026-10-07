import * as z from "zod";
import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: "Ошибка валидации",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "Файл слишком большой. Максимальный размер 2 MB",
      });
    }

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  if (error.message === "Можно загружать только JPEG или PNG") {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    error: "Внутренняя ошибка сервера",
  });
};

export default errorHandler;