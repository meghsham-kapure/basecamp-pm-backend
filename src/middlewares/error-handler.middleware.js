import { isProd } from "../utils/environment-check.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const log = req.log ?? logger;
  const statusCode = err.statusCode ?? err.status ?? 500;

  if (statusCode >= 500) {
    log.error({ err }, "Unhandled error");
  } else {
    log.warn({ err }, err.message);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 && isProd() ? "Internal Server Error" : err.message,
    ...(!isProd() && { stack: err.stack }),
  });
};
