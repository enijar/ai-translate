import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import translate from "../services/translate";

const requestBody = z.object({
  text: z.string().min(1).max(500),
  language: z.string().transform((language) => language.toLowerCase()),
});

export default async function translateText(req: Request, res: Response) {
  try {
    const data = requestBody.parse(req.body);
    const translated = await translate(data.text, data.language);

    if (!translated.success) {
      return res.status(translated.status ?? 500).json({ errors: translated.errors ?? [{ message: "Server error" }] });
    }

    res.status(translated.status ?? 200).json(translated.response ?? {});
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({ errors: err.issues });
    }
    console.error(err);
    res.status(500).json({ errors: [{ message: "Server error" }] });
  }
}
