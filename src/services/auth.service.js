import * as authRepository from "../repositories/auth.repository.js";
import { ApiErrorResponse } from "../utils/api-error-response.js";
import { emailVerificationMailContent } from "../templates/mail.template.js";
import { sendEmail } from "./mail.service.js";

export const createTokens = async (user) => {
  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  user.refreshToken = refreshToken;
  await authRepository.saveUser(user);

  return { accessToken, refreshToken };
};

export const registerUser = async ({
  userName,
  fullName,
  email,
  password,
  role,
  baseUrl,
}) => {
  const existingUser = await authRepository.findByUserNameOrEmail({
    userName,
    email,
  });

  if (existingUser) {
    throw new ApiErrorResponse({
      status: 409,
      name: "Resource Conflict",
      message: "User already exists",
    });
  }

  const newUser = await authRepository.createUser({
    email,
    fullName,
    password,
    userName,
    isEmailVerified: false,
    role,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    newUser.createTempTokens();

  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationExpiry = tokenExpiry;
  await authRepository.saveUser(newUser);

  const verificationLink = `${baseUrl}/api/v1/auth/verify-email/${unHashedToken}`;

  await sendEmail({
    to: newUser.email,
    subject: "Email verification for new user",
    mailGeneratorContent: emailVerificationMailContent(
      newUser.userName,
      verificationLink,
    ),
  });

  return {
    _id: newUser._id,
    isEmailVerified: newUser.isEmailVerified,
    fullName: newUser.fullName,
    userName: newUser.userName,
    email: newUser.email,
    role: newUser.role,
    emailVerificationExpiry: newUser.emailVerificationExpiry,
  };
};

export const loginUser = async ({ userName, email, password }) => {
  if (!userName && !email) {
    throw new ApiErrorResponse({
      status: 400,
      name: "Bad Request",
      message: "Username or email is required",
    });
  }

  if (!password) {
    throw new ApiErrorResponse({
      status: 400,
      name: "Bad Request",
      message: "Password is required",
    });
  }

  const user = await authRepository.findByUserNameOrEmail({ userName, email });
  const isPasswordCorrect = user && (await user.isPasswordCorrect(password));

  if (!isPasswordCorrect) {
    throw new ApiErrorResponse({
      status: 401,
      name: "Unauthorized",
      message: "Invalid credentials",
    });
  }

  const { accessToken, refreshToken } = await createTokens(user);
  const loggedInUser = await authRepository.findPublicUserById(user._id);

  return { user: loggedInUser, accessToken, refreshToken };
};
