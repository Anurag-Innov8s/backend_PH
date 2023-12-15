import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
const jwt_secret: string = process.env.jwt_secret as string;
const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("You must Login first.");
    }
    const token: string = (authorization as string).replace("Bearer ", "");
    jwt.verify(token, jwt_secret, async (err: any, payload: any) => {
      if (err) {
        throw new Error("You must Login first.");
      }
      const { _id } = payload;
      const userData = await User.findById(_id);
      if (userData) {
        req.user = <any>userData;
      }
      next();
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
export default authentication;
