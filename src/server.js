import "dotenv/config";

import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);

console.log(`Application server of "${process.env.APP_NAME}" is starting...`);

const server = app.listen(port, () => {
  console.log(`Application Server listening on port "http://localhost:${port}"`);
});
