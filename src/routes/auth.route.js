import { Router } from "express";

import { validate } from "./../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";

import { registerUser, login } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validate, registerUser);

authRouter.route("/login").post(userLoginValidator(), validate, login);

export { authRouter };
