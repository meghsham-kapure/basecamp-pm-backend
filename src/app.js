import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFound } from "./middlewares/not-found.middleware.js";
import { apiLimiter } from "./middlewares/rate-limit.middleware.js";
import { traceRequest } from "./middlewares/request-trace.middleware.js";
import { rootRouter } from "./routes/root.route.js";
import { logger } from "./utils/logger.js";
import { isProd } from "./utils/environment-check.js";

const app = express();
app.set("trust proxy", isProd() ? 1 : false);

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") ?? [
  "http://localhost:5173",
];

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(compression());

app.use(traceRequest);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.trace.id,
    autoLogging: {
      ignore: (req) => req.url.startsWith("/api/v1/healthcheck"),
    },
  }),
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "64kb" }));

app.use(express.urlencoded({ extended: true, limit: "64kb" }));

app.use(cookieParser());

app.use(express.static("public"));

app.use("/api", apiLimiter);

app.use("/api/v1", rootRouter);

app.use(notFound);

app.use(errorHandler);

export { app };
