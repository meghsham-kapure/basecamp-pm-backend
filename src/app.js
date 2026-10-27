import express from "express";
import cors from "cors";
const app = express();

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") ?? ["http://localhost:5173"];

// Disables the X-Powered-By header
app.disable("x-powered-by");

// Enables JSON parsing
app.use(express.json({ limit: "64kb" }));

// Enables URL-encoded parsing
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

// Serves static files
app.use(express.static("public"));

// Enables CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

import rootRouter from "./routes/root-route.js";
app.use("/api/v1", rootRouter);

export default app;
