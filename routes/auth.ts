import express, { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";      
import * as dotenv from "dotenv";
dotenv.config();
const jwt_secret: string = process.env.JWT_secret as string;
const router = express.Router();
router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      
      res.status(400).json({ msg: "Please fill all fields carefully" });
      return;
    }
    try {
    const finduser = await User.findOne(
      { email: email },
    );
    if (finduser) {
      throw new Error("User already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Registration Successful",
    });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/signin", async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({error:"Please fill all the fields carefully."})
    }
    try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found.")
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ _id: user.id }, jwt_secret);
      res.json({ success: true, token });
    } else {
      throw new Error("Invalid Password")
    }
  } catch (error:any) {
    res.status(500).json({
        error: error.message
    });
  }
});
export default router;
