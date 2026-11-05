import { validationResult } from "express-validator";
import {
  signToken,
  verifyToken,
  decodeToken,
} from "../utils/json-web-token.js";

import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiSuccessResponse } from "../utils/api-success-response.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("Unauthorized access");
  }

  const verifiedAccessToken = verifyToken(accessToken, "access");

  if (verifiedAccessToken.status == "Verified") {
    const userId = verifiedAccessToken?.payload["_id"];
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(
        "Unauthorized access" + err
          ? JSON.stringify(err, Object.getOwnPropertyNames(err))
          : "NO ERROR OBJECT FOUND",
      );
    }
    req.user = user;
    next();
  } else {
    throw new Error("Unauthorized access");
  }
});

export { authenticate };
