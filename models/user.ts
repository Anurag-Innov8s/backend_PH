import mongoose from "mongoose";
interface IUser {
  profilePic: string;
  name: string;
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema({
  profilePic:{
    type:String,
    default:""
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model<IUser>("User", userSchema);
export default User;
