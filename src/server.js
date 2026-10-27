import "dotenv/config";

import app from "./app.js";
import connectDB from "./db/index.js";

const port = Number(process.env.PORT ?? 3000);

console.log(`Application server of "${process.env.APP_NAME}" is starting...`);

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Application Server listening on port "http://localhost:${port}"`));
  })
  .catch((err) => {
    console.error("MongoDB Connection Error : ", err);
    process.exit(1);
  });
