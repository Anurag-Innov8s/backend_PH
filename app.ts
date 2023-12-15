import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import createPost from "./routes/createPost";
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(createPost);
mongoose.connect(process.env.Mongo_url as string, {
  dbName: "Social_media_backend",
});
console.log("Database Connected");
app.listen(process.env.port as string, () => {
  console.log("Server Started");
});