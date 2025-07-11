import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../model/UserModel";
import { Content } from "../model/ContentModel";
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
});
export const userSignup = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).send(result.error.format());
  } else {
    try {
      const user =
        (await User.findOne({ username: req.body.username })) ||
        (await User.findOne({ email: req.body.email }));
      if (!user) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
        });
        res.status(200).send("you signup successfully!");
      } else {
        res.status(409).send("user already exists!!!");
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
};
export const userSignin = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const matched = await bcrypt.compare(req.body.password, user.password!);
      if (matched) {
        const token = jwt.sign(
          { id: user._id },
          String(process.env.JWT_PASSWORD as string),
          { expiresIn: "1h" }
        );
        res.status(200).json({ token: token });
      } else {
        res.status(400).send("invalid credentials");
      }
    } else {
      res.status(404).send("user doesn't exist");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const userProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    const contents = await Content.find({ createdBy: req.userId });
    res.status(200).send({
      username: user?.username,
      email: user?.email,
      posts: contents?.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user) {
      const matched = await bcrypt.compare(
        req.body.oldPassword,
        user.password!
      );
      if (matched) {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        await User.updateOne(
          { _id: req.userId },
          { $set: { password: hashedPassword } }
        );
        res.status(200).send("Password Updated Successfully");
      } else {
        res.status(400).send("invalid credentials");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
