import type { Request, Response } from "express";
import z from "zod";

const schema = z.object({
  text: z.string().min(1).max(500),
});

export default async function translate(req: Request, res: Response) {
  const data = schema.parse(req.body);
  res.json(data);
}
