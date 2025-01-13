import { z, ZodSchema } from "zod";
import { Request, Response } from "express";

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown error occurred";
}

export const parseRequest = <T>(
  schema: ZodSchema<T>,
  body: unknown,
  res: Response
): T | null => {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    res.status(422).json({
      errors: parsed.error.errors.map((e) => e.message),
    });
    return null;
  }
  return parsed.data;
};
