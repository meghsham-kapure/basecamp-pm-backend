import { Router } from "express";

const rootRouter = Router();

import healthcheckRouter from "./healthcheck-route.js";
rootRouter.use("/healthcheck", healthcheckRouter);

export default rootRouter;
