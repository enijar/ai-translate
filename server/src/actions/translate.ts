import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { Configuration, OpenAIApi } from "openai";
import config from "../config";
import languages from "../../../shared/languages";

const configuration = new Configuration({
  apiKey: config.openAiApiKey,
});
const openai = new OpenAIApi(configuration);

const requestBody = z.object({
  text: z.string().min(1).max(500),
  language: z.string().transform((language) => language.toLowerCase()),
});

const openAiApiResponse = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(
    z.object({
      text: z.string(),
      index: z.number(),
      logprobs: z.any().nullable(),
      finish_reason: z.string(),
    }),
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

function generatePrompt(text: string, language: string) {
  const parsedLanguage = [language.slice(0, 1).toUpperCase(), language.slice(1)].join("");
  return `Translate the following text from English to ${parsedLanguage}: ${text}`;
}

export default async function translate(req: Request, res: Response) {
  try {
    const data = requestBody.parse(req.body);

    if (!languages.includes(data.language)) {
      return res.status(422).json({ errors: [{ message: `Invalid language. Must be one of ${languages.join(",")}` }] });
    }

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(data.text, data.language),
      temperature: 0.2,
    });

    const result = openAiApiResponse.parse(completion.data);

    if (result.choices.length === 0) {
      return res.status(404).json({ errors: [{ message: "No result" }] });
    }

    res.json(result.choices[0].text);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({ errors: err.issues });
    }
    console.error(err);
    res.status(500).json({ errors: [{ message: "Server error" }] });
  }
}
