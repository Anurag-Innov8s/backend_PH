import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
const jwt_secret: string = process.env.jwt_secret as string;
const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(400).json({
      err: "You must login first",
    });
    return;
  }
  const token: string = (authorization as string).replace("Bearer ", "");
  jwt.verify(token, jwt_secret, (err: any, payload: any) => {
    if (err) {
      return res.status(401).json({
        err: "You must login first",
      });
    }
    const { _id } = payload;
    User.findById(_id);
  });
  res.json({ msg: "You are logged in" });
  next();
};
export default authentication;
