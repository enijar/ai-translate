import type { Request, Response } from "express";
import z, { ZodError } from "zod";

const schema = z.object({
  text: z.string().min(1).max(500),
});

export default async function translate(req: Request, res: Response) {
  try {
    const data = schema.parse(req.body);
    res.json(data);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({ errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ errors: [{ message: "Server error" }] });
  }
}
