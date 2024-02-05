import { UserModel } from "../Models/user_model";
import express, { Request, Response } from "express";
import { User } from "../types/userType";

const user = new UserModel();

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await user.getAllUsers();
    res.json({
      status: 200,
      data: result,
      message: "Here it is all users data",
    });
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const result = await user.getUserById(req.params.id);
    if (!result)
      return res.status(404).json({ error: `requested user doesn't exist` });
    res.json({
      status: 200,
      data: result,
    });
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, role, image, phone } = req.body;
    if (!username || username.length < 3)
      throw new Error("please enter a valid username");
    if (password) {
      if (password.length < 6) {
        throw new Error("please add a valid password");
      }
    }
    if (!role) throw new Error("Select a role ether a seller or customer");
    if (!email || email.length < 10)
      throw new Error("please add a valid email");

    const userData: User = {
      email,
      password,
      username,
      role,
    };

    if (image) userData.image = image;
    if (!image) {
      if (username) {
        const newImage = `https://ui-avatars.com/api/?name=${username
          .split(" ")
          .join("+")}`;
        userData.image = newImage;
      }
    }
    if (phone) userData.phone = phone;
    const createdUser = await user.create(userData);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await user.deleteUser(req.params.id);
    res.json({
      status: 200,
      data: result,
      message: "The user has been DELETED successfully",
    });
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, username, image, phone, isValidEmail } = req.body;
    const id = req.params.id;
    const userData: Partial<User> = {};

    if (email) userData.email = email;
    if (username) userData.username = username;
    if (image) userData.image = image;
    if (phone) userData.phone = phone;
    if (isValidEmail) userData.isValidEmail = isValidEmail;
    const result = await user.updateUser(id, userData);
    res.json({
      status: 200,
      data: result,
      message: "The user has been UPDATED successfully",
    });
  } catch (error) {
    res.status(400).json(`${error}`);
  }
};
