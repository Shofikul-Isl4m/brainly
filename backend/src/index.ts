// ✅ Top of the file
import dotenv from "dotenv";
dotenv.config(); // ⬅️ Must come before using process.env

import express from "express";
import cors from "cors";
import connectDB from "./database/db";
import userRouter from "./routes/user.router";
import contentRouter from "./routes/content.router";
import shareRouter from "./routes/share.router";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Optional: log the env variable to verify it's loaded
console.log("MONGO_URI:", process.env.MONGO_URI); // should NOT be undefined

connectDB();

app.use("/", userRouter);
app.use("/content", contentRouter);
app.use("/", shareRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
