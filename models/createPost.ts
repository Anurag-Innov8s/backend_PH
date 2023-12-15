import mongoose, { Schema, Types } from "mongoose";
interface IUser {
  posts: IPost[] | Types.ObjectId[];
}
interface IPost {
  body: string;
  photo: string;
  postedBy: Types.ObjectId | IUser;
}
const postSchema: Schema<IPost> = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "picture url",
    required: true,
  },
  postedBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});
export const Post = mongoose.model<IPost>("POST", postSchema);
