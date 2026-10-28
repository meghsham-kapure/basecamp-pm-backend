import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new Schema(
  {
    avatar: {
      url: String,
      localPath: String,
    },

    fullName: {
      type: String,
      unique: true,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, process.env.BCRYPT_HASH_ROUNDS);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

userSchema.methods.createTempTokens = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const expiresIn = 1000 * 60 * 30; // (ms*sec*min)
  const tokenExpiry = Date.now() + expiresIn;
  return { unHashedToken, hashedToken, tokenExpiry };
};
export default mongoose.model("User", userSchema);
