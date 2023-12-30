import express from "express";
const router = express.Router();
import authentication from "../middleware/authentication";
import { Post } from "../models/createPost";
import User from "../models/user";
router.post("/post", authentication, async (req, res) => {
  try {
    const { body, picture } = req.body;
    if (!body) {
      throw new Error("Please fill all the fields.");
    } else {
      const post = await Post.create({
        body: body,
        photo: picture,
        postedBy: req.user,
      });
      res.status(200).json({ message: "Posted Successfully" });
    }
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});
router.get("/getposts", async (req, res) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = parseInt(req.query.limit as string, 10) || 10;
  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .populate("postedBy", "_id email name profilePic")
      .limit(limit)
      .exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/myPosts", authentication, async (req, res) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = parseInt(req.query.limit as string, 10) || 10;
  try {
    const mypost = await Post.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("postedBy", "_id email name profilePic")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.json(mypost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.put("/like", authentication, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name Photo")
      .exec();
    res.json({ success: true });
  } catch (err: any) {
    res.status(422).json({ error: err.message });
  }
});
router.put("/unlike", authentication, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name Photo")
      .exec();

    res.json({ success: true });
  } catch (err: any) {
    res.status(422).json({ error: err.message });
  }
});
router.put("/uploadProfilePic", authentication, async (req, res) => {
  try {
    const pic = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { profilePic: req.body.profilePic },
      },
      {
        new: true,
      }
    ).exec();
    res.status(200).json({ success: "Profile picture updated successfully." });
  } catch (err: any) {
    res.status(422).json({ error: err.message });
  }
});
router.get("/getProfile",authentication,async(req,res)=>{
  res.json(req.user)
})
export default router;
