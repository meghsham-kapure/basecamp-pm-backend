import "dotenv/config";

import os from "node:os";

import mongoose from "mongoose";

import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import { logger } from "./utils/logger.js";
import { validateEnv } from "./utils/validate-env.js";

const port = Number(process.env.PORT ?? 3000);

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Unhandled promise rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});

logger.info("Application server is starting...");

validateEnv()
  .then(() => connectDB())
  .then(() => {
    logger.info("MongoDB connection successful");

    const server = app.listen(port, () => {
      const lanIp = Object.values(os.networkInterfaces())
        .flat()
        .find((i) => i.family === "IPv4" && !i.internal)?.address;

      logger.info(`Server started on port ${port}`);
      logger.info(`Local:   http://localhost:${port}`);
      if (lanIp) logger.info(`Network: http://${lanIp}:${port}`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received, shutting down...`);

      server.close(async () => {
        await mongoose.connection.close();
        logger.info("Shutdown complete");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    logger.error({ err }, "Startup failed");
    process.exit(1);
  });
