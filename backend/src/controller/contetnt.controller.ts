import { Request, Response } from "express";
import { Content } from "../model/ContentModel";

export const contentPost = async (req: Request, res: Response) => {
  try {
    const { title, link, tags } = req.body;

    if (!title || !link) {
      return res.status(400).send("Please fill in all required fields.");
    }

    await Content.create({
      title,
      link,
      createdBy: req.userId, // Ensure req.id is populated via middleware
      tags,
    });

    res.status(201).send("New content added successfully.");
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).send("Internal server error.");
  }
};
export const contentGet = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const contents = await Content.find({ createdBy: req.userId });

    res.status(200).json({ contents });
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const ContentGetId = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });
    res.json({ content: content });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const ContentPutId = async (req: Request, res: Response) => {
  try {
    const content = await Content.updateOne(
      { _id: req.params.id, createdBy: req.userId },
      {
        $set: {
          title: req.body.title,
          link: req.body.link,
          tags: req.body.tags,
        },
      }
    );
    const content2 = await Content.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });
    res.json({ content: content2 });
  } catch (error) {
    console.log(error);
    res.send("hello from simple server :)");
  }
};
export const ContentDelete = async (req: Request, res: Response) => {
  try {
    await Content.deleteMany({ createdBy: req.userId });
    res.send("All Contents Deleted Successfully");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const ContentDeleteId = async (req: Request, res: Response) => {
  try {
    await Content.deleteOne({ _id: req.params.id, createdBy: req.userId });
    res.send("Selected Content Deleted");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
