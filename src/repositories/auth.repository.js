import { User } from "../models/user.model.js";

const PUBLIC_FIELDS =
  "-password -isEmailVerified -emailVerificationToken -refreshToken -forgotPasswordToken -forgotPasswordExpiry";

export const findByUserNameOrEmail = ({ userName, email }) => {
  const conditions = [];
  if (userName) conditions.push({ userName });
  if (email) conditions.push({ email });

  return User.findOne({ $or: conditions });
};

export const createUser = (data) => User.create(data);

export const findPublicUserById = (id) =>
  User.findById(id).select(PUBLIC_FIELDS);

export const saveUser = (user) => user.save({ validateBeforeSave: false });
