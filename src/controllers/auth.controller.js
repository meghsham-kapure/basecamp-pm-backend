import User from "../models/user-model.js ";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { emailVerificationMailContent, sendEmail } from "../utils/mail.js";

const createTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error with creating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email / username is already exists!", []);
  }

  const newUser = await User.create({
    email,
    fullName,
    password,
    userName,
    isEmailVerified: false,
    role,
  });

  const { unHashedToken, hashedToken, tokenExpiry } = newUser.createTempTokens();

  const { accessToken, refreshToken } = createTokens(newUser._id);

  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationExpiry = tokenExpiry;

  await newUser.save({
    validateBeforeSave: false,
  });

  const emailBody = emailVerificationMailContent(
    newUser.userName,
    `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken} `,
  );

  await sendEmail({
    to: newUser?.email,
    subject: "Email verification for new user",
    mailGeneratorContent: emailBody,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -isEmailVerified -emailVerificationToken -refreshToken -forgotPasswordToken -forgotPasswordExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Error in registering user");
  }

  return res.status(201).json(new ApiResponse(200, { user: createdUser }, "User registration successful, verification email sent on you email!"));
});

export { registerUser, createTokens };
