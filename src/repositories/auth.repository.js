import { User } from "../models/user.model.js";

export const createUser = (data) => User.create(data);

export const saveUser = ({ user, validateBeforeSave = true }) =>
  user.save({ validateBeforeSave });

export const findByUserNameOrEmail = ({ userName, email }) => {
  const conditions = [];
  if (userName) conditions.push({ userName });
  if (email) conditions.push({ email });

  return User.findOne({ $or: conditions });
};

export const findPublicUserById = (id) => User.findById(id);
