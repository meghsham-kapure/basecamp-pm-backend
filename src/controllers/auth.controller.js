import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  cookieOptions,
} from "../constants/cookie.constant.js";
import * as authService from "../services/auth.service.js";
import { ApiErrorResponse } from "../utils/api-error-response.js";
import { ApiSuccessResponse } from "../utils/api-success-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await authService.registerUser({
    ...req.validated,
    baseUrl: `${req.protocol}://${req.get("host")}`,
  });

  return res.status(201).json(
    new ApiSuccessResponse({
      status: 201,
      message: "Resource Created",
      data: user,
      req,
    }),
  );
});

export const verify = asyncHandler(async (req, res) => {
  const { userName, verificationToken } = req.validated;
  await authService.verifyUser({ userName, verificationToken });
  return res.status(204).send();
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(
    req.body,
  );

  return res
    .status(200)
    .cookie(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions)
    .cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions)
    .json(
      new ApiSuccessResponse({
        status: 200,
        message: "User login successful!",
        data: { user, accessToken, refreshToken },
        req,
      }),
    );
});

export const logout = asyncHandler(async (req, res) => {});
