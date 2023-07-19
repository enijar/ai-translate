import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import translate from "../services/translate";
import file from "../services/file";

const requestBody = z.object({
  language: z.string().transform((language) => language.toLowerCase()),
});

export default async function translateFile(req: Request, res: Response) {
  try {
    if (req.file === undefined) {
      return res.status(422).json({ errors: [{ message: "Not file" }] });
    }
    const uploadedFile = await file.upload(req.file);

    const data = requestBody.parse(req.body);
    const text = await file.extractText(uploadedFile.path);

    if (text === null) {
      return res.status(422).json({ errors: [{ message: "Unable to process file" }] });
    }

    const translated = await translate(text, data.language);

    res.status(translated.status ?? 200).json(translated.response ?? {});
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({ errors: err.issues });
    }
    console.error(err);
    res.status(500).json({ errors: [{ message: "Server error" }] });
  }
}
