import mongoose, { Schema, model } from "mongoose";

const ContentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [{ type: String }],

    createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export const Content = model("content", ContentSchema);
