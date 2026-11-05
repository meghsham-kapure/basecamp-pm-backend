import pino from "pino";

import { isProd } from "./environment-check.js";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { app: process.env.APP_NAME },
  transport: isProd()
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:yyyy-mm-dd'T'HH:MM:ss.lo",
          ignore: "hostname,app",
          messageFormat: "[{app}] : {msg}",
        },
      },
});

export { logger };
