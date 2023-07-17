import app from "./services/app";
import translate from "./actions/translate";

app.post("/api/translate", translate);
