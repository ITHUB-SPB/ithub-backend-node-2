import type { Request, Response, NextFunction } from "express";
import * as z from "zod";

type Kind = "body" | "query";

export default function validate(
  schema: z.ZodType,
  kind: Kind,
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(req[kind]);

    if (!result.success) {
      throw result.error;
    }

    req[kind] = result.data;

    next();
  };
}