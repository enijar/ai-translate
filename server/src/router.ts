import * as multer from "multer";
import app from "./services/app";
import translateText from "./actions/translate-text";
import translateFile from "./actions/translate-file";
import config from "./config";

const upload = multer({ dest: config.storagePath });

app.post("/api/translate-text", translateText);
app.post("/api/translate-file", upload.single("file"), translateFile);
