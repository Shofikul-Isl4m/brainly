import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      reuired: [true, "Password should be 8 character long"],
      minlength: 8,
    },
  },
  { timestamps: true }
);
export const User = model("user", UserSchema);
