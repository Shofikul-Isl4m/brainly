import mongoose, { model, Schema } from "mongoose";

const shareSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user ",
      required: true,
    },
    isSharing: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const shareModel = model("share", shareSchema);
