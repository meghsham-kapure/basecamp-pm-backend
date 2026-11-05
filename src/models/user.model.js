import mongoose, { Schema } from "mongoose";
import crypto from "node:crypto";
import bcrypt from "bcrypt";

import {
  signToken,
  verifyToken,
  decodeToken,
} from "../utils/json-web-token.js";

const userSchema = new Schema(
  {
    avatar: {
      url: String,
      localPath: String,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 4,
      maxlength: 128,
    },

    userName: {
      type: String,
      required: [true, "Username is required"],
      index: true,
      trim: true,
      lowercase: true,
      minlength: 4,
      maxlength: 32,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 4,
      maxlength: 256,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      default: "User",
    },

    isEmailVerified: {
      type: Boolean,
      required: [true, "Email verification status is required"],
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },

    emailVerificationExpiry: {
      type: Date,
    },

    refreshToken: {
      type: String,
    },

    refreshTokenExpiry: {
      type: Date,
    },

    forgotPasswordToken: {
      type: String,
    },

    forgotPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_HASH_ROUNDS),
  );
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createAccessToken = function () {
  return signToken(this, "access");
};

userSchema.methods.createRefreshToken = function () {
  return signToken(this, "refresh");
};

userSchema.methods.createTempTokens = function () {
  const unHashedToken = crypto.randomBytes(16).toString("hex");
  console.log(unHashedToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const expiresIn = 1000 * 60 * 30; // (ms*sec*min)
  const tokenExpiry = Date.now() + expiresIn;

  return { unHashedToken, hashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);

export { User };
