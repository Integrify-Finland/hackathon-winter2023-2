import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User";
import { jwtSecret } from "../config/keys";
import { errorHandler } from "../utils/errorHandler";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(401).json({ msg: "Email is exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashPassword });

    res.status(200).json({ msg: "User created" });
  } catch (err) {
    errorHandler(res, err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Email does not exist" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = JWT.sign({ email, id: user._id }, jwtSecret, {
        expiresIn: 60 * 60,
      });

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({
        email,
      });
    }
  } catch (err) {
    errorHandler(res, err);
  }
};
