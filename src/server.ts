import app from "./app";
import config from "./config";
import { initDb } from "./db";


const main = () => {

  initDb();

app.listen(config.port || 5000, () => {
  console.log(`listening on port ${config.port || 5000}`);
});
}

main();