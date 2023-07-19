import * as crypto from "node:crypto";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Express } from "express";
import * as mammoth from "mammoth";
import config from "../config";

const file = {
  async upload(file: Express.Multer.File) {
    const readStream = createReadStream(file.path);
    const checksum = await new Promise<string>((resolve) => {
      const hash = crypto.createHash("sha256");
      readStream.on("data", (chunk) => hash.update(chunk));
      readStream.on("end", () => {
        resolve(hash.digest("hex"));
      });
    });
    await fs.rename(file.path, path.join(config.storagePath, checksum));
    return {
      path: path.join(config.storagePath, checksum),
      name: checksum,
    };
  },
  async extractText(filePath: string) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
};

export default file;
