import mongoose, { Schema, Types } from "mongoose";
interface IUser {
  posts: IPost[] | Types.ObjectId[];
}
interface IPost {
  body: string;
  photo: string;
  postedBy: Types.ObjectId | IUser;
  likes:Types.ObjectId;
}
const postSchema: Schema<IPost> = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "",
    required: true,
  },
  postedBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes:[{
    type:Types.ObjectId,
    ref:"User"
  }],
},
{
    timestamps:true
  }
);
export const Post = mongoose.model<IPost>("POST", postSchema);
