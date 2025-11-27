import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: result.error.issues.map((i) => ({
          campo: i.path.join("."),
          mensaje: i.message,
          // opcionalmente: code: i.code
        })),
      });
    }

    
    req.body = result.data;
    next();
  };
