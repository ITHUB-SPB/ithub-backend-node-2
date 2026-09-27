import type { Request, Response, NextFunction } from "express";
import * as z from "zod";

type Kind = "body" | "query";

type RequestParsed = Request & {
  bodyParsed?: any;
  queryParsed?: any;
};

export default function validate(schema: z.ZodType, kind: Kind) {
  return (request: RequestParsed, _: Response, next: NextFunction) => {
    const result = schema.safeParse(request[kind]);

    if (result.error) {
      throw result.error;
    }

    request[`${kind}Parsed`] = result.data;
    next();
  };
}
