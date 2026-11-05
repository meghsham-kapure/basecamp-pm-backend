import { body, param, cookie, header } from "express-validator";
import { ROLE_VALUES } from "../constants/role.constant.js";
import { VALIDATION_ERROR_MESSAGE } from "../constants/error-message.constant.js";

export const userRegisterValidator = () => {
  return [
    body("avatar")
      .optional()
      .default("avatar-1")
      .isIn(["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"])
      .withMessage(VALIDATION_ERROR_MESSAGE.AVATAR_VALUE_ERROR),

    body("fullName")
      .trim()
      .isLength({ min: 4, max: 64 })
      .withMessage(VALIDATION_ERROR_MESSAGE.FULL_NAME_LENGTH_ERROR),

    body("email")
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_ERROR_MESSAGE.EMAIL_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_ERROR_MESSAGE.EMAIL_FORMAT_ERROR),

    body("userName")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage(VALIDATION_ERROR_MESSAGE.USER_NAME_ERROR)
      .isLength({ min: 4, max: 32 })
      .withMessage(VALIDATION_ERROR_MESSAGE.USER_NAME_LENGTH_ERROR),

    body("password")
      .notEmpty()
      .withMessage(VALIDATION_ERROR_MESSAGE.PASSWORD_ERROR)
      .isLength({ min: 4, max: 32 })
      .withMessage(VALIDATION_ERROR_MESSAGE.PASSWORD_LENGTH_ERROR),

    body("role")
      .optional()
      .isIn(["User", "SuperUser", "Admin", "SuperAdmin", "DON"])
      .withMessage(VALIDATION_ERROR_MESSAGE.ROLE_UNDEFINED_ERROR)
      .default("User"),
  ];
};

export const userVerifyValidator = () => {
  return [
    param("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage(VALIDATION_ERROR_MESSAGE.EMAIL_FORMAT_ERROR),

    param("verificationToken")
      .isLength({ min: 32, max: 32 })
      .withMessage(VALIDATION_ERROR_MESSAGE.TOKEN_FORMAT_ERROR),
  ];
};

export const userLoginValidator = () => {
  return [
    body().custom((_, { req }) => {
      const { email, userName } = req.body;
      if (!email === !userName) {
        throw new Error("Invalid Input");
      }
      return true;
    }),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage(VALIDATION_ERROR_MESSAGE.EMAIL_FORMAT_ERROR),

    body("userName")
      .optional()
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 30 })
      .withMessage(VALIDATION_ERROR_MESSAGE.USER_NAME_LENGTH_ERROR),

    body("password")
      .notEmpty()
      .withMessage(VALIDATION_ERROR_MESSAGE.PASSWORD_ERROR)
      .isLength({ min: 3, max: 30 })
      .withMessage(VALIDATION_ERROR_MESSAGE.PASSWORD_LENGTH_ERROR),

    body("role")
      .optional()
      .isIn(ROLE_VALUES)
      .withMessage(VALIDATION_ERROR_MESSAGE.ROLE_UNDEFINED_ERROR),
  ];
};
