import express, { Request, Response } from "express";
import User from "../Database/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config({
  path: "./config.env",
});
const jwt_secret: string = process.env.JWT_secret as string;
const router = express.Router();
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ msg: "Please fill all fields carefully" });
      return;
    }
    const finduser = await User.findOne({
      $or: [{ email: email }, { name: name }],
    });
    if (finduser) {
      res.status(422).json({
        error: "User already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Registration Successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(422).json({
        error: "Please fill Email and Password carefully",
      });
      return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ _id: user.id }, jwt_secret);
      res.json({ success: true, token });
    } else {
      res.status(401).json({
        error: "Invalid password",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});
export default router;
