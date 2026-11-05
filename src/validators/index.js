import { body } from "express-validator";
import { ROLE_VALUES } from "../constants/role.constant.js";

export const userRegisterValidator = () => {
  return [
    body("avatar")
      .optional()
      .default("avatar-1")
      .isIn(["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"])
      .withMessage("Invalid avatar name, choose from enumerated values"),

    body("fullName")
      .trim()
      .isLength({ min: 4, max: 64 })
      .withMessage(
        "Invalid full name, full name length should be in 4-64 character",
      ),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Invalid email, email is required")
      .isEmail()
      .withMessage("Invalid email, email format is not correct"),

    body("userName")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Invalid username, username is required")
      .isLength({ min: 4, max: 32 })
      .withMessage(
        "Invalid username, username length should be in 4-32 character",
      ),

    body("password")
      .notEmpty()
      .withMessage("Invalid password, password is required")
      .isLength({ min: 4, max: 32 })
      .withMessage(
        "Invalid password, password length should be in 4-32 character",
      ),

    body("role")
      .optional()
      .isIn(["User", "SuperUser", "Admin", "SuperAdmin", "DON"])
      .withMessage("Invalid role, role should be one of the enumerated values")
      .default("User"),
  ];
};

export const userLoginValidator = () => {
  return [
    body().custom((_, { req }) => {
      const { email, userName } = req.body;
      if (!email === !userName) {
        throw new Error(
          "Send either email or username, not both" + err
            ? JSON.stringify(err, Object.getOwnPropertyNames(err))
            : "NO ERROR OBJECT FOUND",
        );
      }
      return true;
    }),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("email format invalid"),

    body("userName")
      .optional()
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username length should be in 3 -30 character"),

    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Password length should be in 3 -30 character"),

    body("role").optional().isIn(ROLE_VALUES).withMessage("Invalid role"),
  ];
};
