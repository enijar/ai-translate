import z, { ZodError } from "zod";
import { Configuration, OpenAIApi } from "openai";
import config from "../config";
import languages from "../../../shared/languages";

type ApiResponse = {
  text: string;
  language: string;
  result: string;
};

type CacheKey = `${ApiResponse["text"]}-${ApiResponse["language"]}`;

const cache = new Map<CacheKey, ApiResponse>();

const configuration = new Configuration({
  apiKey: config.openAiApiKey,
});
const openai = new OpenAIApi(configuration);

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

const STOP_TOKEN = "!?#:";

function generatePrompt(text: string, language: string) {
  const parsedLanguage = [language.slice(0, 1).toUpperCase(), language.slice(1)].join("");
  return `Translate the following English text to ${parsedLanguage}:
${text}${STOP_TOKEN}`;
}

export default async function translate(text: string, language: string) {
  try {
    if (!languages.includes(language)) {
      return {
        success: false,
        status: 422,
        errors: [{ message: `Invalid language. Must be one of ${languages.join(",")}` }],
      };
    }

    const key: CacheKey = `${text}-${language}`;
    if (cache.has(key)) {
      return { success: true, status: 200, response: cache.get(key)! };
    }

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(text, language),
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: [STOP_TOKEN],
    });

    const result = openAiApiResponse.parse(completion.data);

    if (result.choices.length === 0) {
      return { success: false, status: 404, errors: [{ message: "No result" }] };
    }

    const apiResponse: ApiResponse = {
      text: text,
      language: language,
      result: result.choices[0].text,
    };

    cache.set(key, apiResponse);

    return { success: true, status: 200, response: apiResponse };
  } catch (err) {
    if (err instanceof ZodError) {
      return { success: false, errors: err.issues };
    }
    console.error(JSON.stringify(err));
    return { success: false, errors: [{ message: "Server error" }] };
  }
}
