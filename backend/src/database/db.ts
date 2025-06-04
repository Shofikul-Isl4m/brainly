import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI from .env:", process.env.MONGO_URI);

    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URI as string
    );
    console.log(
      `MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Your error is:", error);
    process.exit(1); // Gracefully exit the app on failure
  }
};

export default connectDB;
