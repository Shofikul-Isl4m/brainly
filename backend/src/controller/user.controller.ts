import z from "zod";
import { User } from "../model/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Content } from "../model/ContentModel";
const schema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be 3 carachter long " }),
  email: z.string().email({ message: "invalid email adress" }),
  password: z
    .string()
    .min(8, { message: "password must be 8 character long" })
    .regex(/[A-Z]/, {
      message: "password must be contain at least one uppercase later ",
    })
    .regex(/[a-z]/, {
      message: "password must be contain at least one uppercase later",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
});

export const userSignup = async function (req: Request, res: Response) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "validation failed",
      errors: result.error.format(),
    });
  }
  const { username, email, password } = result.data;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "user already exist",
      });
    }

    const hashedPassword = bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    return res.status(201).json({
      message: " User Signup Successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("signup error ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userSignIn = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "validation failed",
      errors: result.error.format(),
    });
  }

  const { username, email, password } = result.data;

  try {
    const user = await User.findOne({ username });

    if (!user || !user.password) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY as string
    );

    return res.status(200).json({
      message: "SignIn Successfull",
      token,
      user: {
        id: user._id,
        username: user.username,
        password: user.password,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const user = await User.findById((req as any).userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const contents = await Content.find({ createdBy: (req as any).userId });

    return res.status(200).json({
      username: user.username,
      email: user.email,
      totalPosts: contents.length,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!(req as any).userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const user = await User.findById((req as any).userId);

    if (!user || !user.password) {
      return res
        .status(404)
        .json({ message: "User not found or missing password" });
    }

    const matched = await bcrypt.compare(oldPassword, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: (req as any).userId },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
