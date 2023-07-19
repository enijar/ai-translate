import * as path from "node:path";
import z from "zod";
import User from "./models/user";

const env = z.object({
  PORT: z.string().transform(Number),
  APP_URL: z.string(),
  CORS_ORIGINS: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_DIALECT: z.enum(["mysql", "sqlite"]),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  OPEN_AI_APK_KEY: z.string(),
});

env.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}

const config = {
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  corsOrigins: process.env.CORS_ORIGINS.split(","),
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    dialect: process.env.DATABASE_DIALECT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    models: [User],
  },
  openAiApiKey: process.env.OPEN_AI_APK_KEY,
  storagePath: path.resolve(__dirname, "..", "storage"),
};

export default config;
