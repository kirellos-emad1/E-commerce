import { Request, Response } from "express";
import { UserModel } from "../Models/user_model";
import * as jwt from "jsonwebtoken";
import { db } from "../db/prisma";
const user = new UserModel();

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.send(400).json("All fields are required");
    }

    // Authenticate user
    const userData = await user.authenticate(email, password);
    if (!userData) {
      return res.status(400).json("the email and password do not match");
    }
    
    // Generate access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: userData.id,
          username: userData.username,
          role: userData.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: userData.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set refresh token as cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      // secure: true, //https
      sameSite: "none", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    
    // Respond with access token and user data
    res.status(200).json({ isAuth: true, accessToken: accessToken, userData });
  } catch (err) {
    console.error("Error in authentication:", err);
    res.status(400).json(`${err}`);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    // Check if refresh token is provided
    if (!cookies?.jwt) return res.status(401).json("Unauthorized");

    const refreshToken = cookies.jwt;

    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) return res.status(403).json("Forbidden");

        // Find user based on decoded id
        const foundUser = await db.user.findUnique({
          where: { id: decoded.id },
        });

        if (!foundUser) return res.status(401).json("Unauthorized");
        
        // Generate new access token
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser.id,
              username: foundUser.username,
              role: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "15m" }
        );
        
        // Respond with new access token
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(400).json(`${error}`);
  }
};

export const logout = (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
  
    // Clear refresh token cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none"});
    res.json({ message: "Cookie cleared" });
  };