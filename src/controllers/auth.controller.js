import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiSuccessResponse } from "../utils/api-success-response.js";
import { ApiErrorResponse } from "../utils/api-error-response.js";
import { emailVerificationMailContent, sendEmail } from "../utils/mail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password, role } = req.validated;

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiErrorResponse({
      status: 409,
      name: "Resource Conflict",
      message: "User already exists",
    });
  }

  const newUser = await User.create({
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

  await newUser.save({
    validateBeforeSave: false,
  });

  const verificationLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken} `;

  const emailBody = emailVerificationMailContent(
    newUser.userName,
    verificationLink,
  );

  await sendEmail({
    to: newUser?.email,
    subject: "Email verification for new user",
    mailGeneratorContent: emailBody,
  });

  const responseUser = {
    _id: newUser["_id"],
    isEmailVerified: newUser["isEmailVerified"],
    fullName: newUser["fullName"],
    userName: newUser["userName"],
    email: newUser["email"],
    role: newUser["role"],
    emailVerificationExpiry: newUser["emailVerificationExpiry"],
  };

  return res.status(201).json(
    new ApiSuccessResponse({
      status: 201,
      message: "Resource Created",
      data: responseUser,
      req,
    }),
  );
});

export const createTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw err;
  }
};

export const login = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new Error("username or email input not exists!");
  }

  if (!password) {
    throw new Error("password input not exists!");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new Error("user does not exists");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid credential");
  }

  const { accessToken, refreshToken } = await createTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -isEmailVerified -emailVerificationToken -refreshToken -forgotPasswordToken -forgotPasswordExpiry",
  );

  if (!loggedInUser) {
    throw new Error("Error in login user");
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // maxAge: 24 * 60 * 60 * 1000, // TODO: change this later
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User login successful!",
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {});
