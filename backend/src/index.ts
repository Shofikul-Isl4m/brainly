require("dotenv").config();

import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import z from "zod";
import bcrypt from "bcrypt";

import { usermiddleware } from "./jwt/middleware";
import { random } from "./utils";
import { JWT_PASSWORD } from "./config";
import cors from "cors";
import { contentModel } from "./model/ContentModel";
import { shareModel } from "./model/ShareModel";
import { userModel } from "./model/UserModel";
import connectDB from "./database/db";
import userRouter from "./routes/user.router";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/", userRouter);
app.use("/content", contentRoutes);
app.use("/", shareRoutes);

app.post("/api/v1/signup", async function (req: Request, res: Response) {
  const signUpSchema = z.object({
    username: z.string(),
    password: z.string(),
  });
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
    return;
  }
  const { username, password } = result.data;
  const hashedPassword = await bcrypt.hash(password, 5); // Added await here

  try {
    await userModel.create({
      // Added await here
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "user signup",
    });
  } catch (error) {
    res.status(500).json({
      // Added proper status code
      message: "signup failed",
    });
  }
});
app.post("/api/v1/signin", async function (req, res) {
  const signInSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const result = signInSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
    return;
  }
  const { username, password } = result.data;

  try {
    const user = await userModel.findOne({
      username,
    });
    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const compare = bcrypt.compare(password, user.password);
    if (!compare) {
      res.status(404).json({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_PASSWORD
    );

    res.status(200).json({
      token,
      message: "signin successfull",
    });
  } catch (error) {
    res.status(501).json({
      message: "signnn failed",
    });
  }
});

app.post("/api/v1/content", usermiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  await contentModel.create({
    link,
    type,
    title: req.body.title,
    userId: req.userId,
    tags: [],
  });

  res.json({
    message: "Content added",
  });
});

app.get("/api/v1/content", usermiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await contentModel
    .find({
      userId: userId,
    })
    .populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", usermiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await contentModel.deleteMany({
    contentId,
    userId: req.userId,
  });

  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", usermiddleware, async function (req, res) {
  const share = req.body.share;
  if (share) {
    const existingUser = await shareModel.findOne({
      userId: req.userId,
    });
    if (existingUser) {
      res.json({
        hash: existingUser.hash,
      });
      return;
    }
    const hash = random(10);
    await shareModel.create({
      userId: req.userId,
      hash,
    });
    res.json({
      hash,
    });
  } else {
    await shareModel.deleteOne({
      userId: req.userId,
    });
    res.json({
      message: "Share link deleted successfully",
    });
  }
});

app.get("/api/v1/brain/:shareLink", usermiddleware, async function (req, res) {
  const hash = req.params.shareLink;
  const link = await shareModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "sorry incorrect input",
    });
    return;
  }

  const content = await contentModel.findOne({
    userId: link.userId,
  });

  const user = await userModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
});

app.listen(3000);
