import { UserModel, User } from "../models/userModel";

export const getAllUsers = async () => {
  return await UserModel.find();
};

export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const createUser = async (data: User) => {
  const user = new UserModel({ ...data});
  return await user.save();
};

export const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};
