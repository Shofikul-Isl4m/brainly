import mongoose, { Schema, model } from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URI as string
    );
    console.log(
      "MongoDB Connected! DB HOST : ${connectionInstance.connection.host}"
    );
  } catch (error) {
    console.error("your erros is : ", error);
    process.exit(1);
  }
};

export default connectDB;
