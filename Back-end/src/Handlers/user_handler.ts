import { UserModel } from "../Models/user_model";
import express, { Request, Response } from "express";
import { User, UserRole } from "../types/userType";

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

export const getSpecificUser = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const result = await user.getSpecificUser(req.params.id);
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

const create = async (
  req: Request,
  res: Response,
  role: UserRole,
  isValidEmail: boolean
): Promise<void> => {
  try {
    const { email, password, username, image, phone } = req.body;
    const userData: User = {
      email,
      password,
      username,
      role,
      isValidEmail,
    };

    if (image) userData.image = image;
    if (phone) userData.phone = phone;
    const createdUser = await user.create(userData);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  await create(req, res, "CUSTOMER", false);
};

export const createSeller = async (
  req: Request,
  res: Response
): Promise<void> => {
  await create(req, res, "SELLER", false);
};
export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  await create(req, res, "ADMIN", true);
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
    res.status(400).json(err);
  }
};

export const updateUser = async (req: Request, res: Response) => {

  try {
    
    const { email, password, username, image, phone, role } = req.body;
    const id = req.params.id
      const userData:Partial<User> = {}
  
      if (email) userData.email= email
      if (password) userData.password= password
      if (username) userData.username= username
      if (image) userData.image= image
      if (phone) userData.phone= phone
      if (role) userData.role= role
      const result = await user.updateUser(id, userData)
      res.json({
        status: 200,
        data: result,
        message: "The user has been DELETED successfully",
      });
  } catch (error) {
    res.status(400).json(error)
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await user.authenticate(email, password);
    if (!userData) {
      return res.status(400).json("the email and password do not match");
    }

    res.status(200).json({ userData });
  } catch (err) {
    res.status(400).json(err);
  }
};
