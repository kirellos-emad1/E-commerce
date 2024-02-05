import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
interface CustomRequest extends Request {
  username?: string;
  role?: string;
}

export const verifyJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.username = decoded.UserInfo.username;
      req.role = decoded.UserInfo.role;
      next();
    }
  );
};
