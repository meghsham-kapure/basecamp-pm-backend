import { Router } from "express";

import { validate } from "./../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userVerifyValidator,
  userLoginValidator,
} from "../validators/index.js";

import { registerUser, verify, login } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validate, registerUser);

authRouter.route("/verify/:userName/:verificationToken").post(
  (req, res, next) => {
    next();
  },
  userVerifyValidator(),
  validate,
  verify,
);

authRouter.route("/login").post(userLoginValidator(), validate, login);

export { authRouter };
