import { rateLimit } from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => req.originalUrl.startsWith("/api/v1/healthcheck"),
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
