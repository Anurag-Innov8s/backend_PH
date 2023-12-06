import express, { Application } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import "./Database/user";
import authRoutes from "./routes/auth";
config({
  path: "./config.env",
});
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes);
try {
  mongoose.connect(process.env.Mongo_url as string, {
    dbName: "Social_media_backend",
  });
  console.log("Database Connected");

  app.listen(process.env.port as string, () => {
    console.log("Server Started");
  });
} catch (e) {
  console.log(e);
}
