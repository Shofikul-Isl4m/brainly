import mongoose, { Schema, model } from "mongoose";

mongoose.connect("mongodb://localhost:27017/brainly");

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const userModel = model("user", UserSchema);
const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
  type: String,
  userId: { type: mongoose.Types.ObjectId, ref: "user" },
});

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user ",
    required: true,
    unique: true,
  },
});

export const contentModel = model("content", ContentSchema);
export const linkModel = model("link", LinkSchema);
