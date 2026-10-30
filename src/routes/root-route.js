import { Router } from "express";

const rootRouter = Router();

import healthcheckRouter from "./healthcheck-route.js";
rootRouter.use("/healthcheck", healthcheckRouter);

import authRouter from "./auth-route.js";
rootRouter.use("/auth", authRouter);

export default rootRouter;
