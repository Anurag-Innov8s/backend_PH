import express from "express";
const router = express.Router();
import authentication from "../middleware/authentication";
import { Post } from "../models/createPost";
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
      res.status(200).json({ post });
    }
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});
router.get("/getPosts", authentication, async (req, res) => {
  try {
    const posts = await Post.find().populate("postedBy", "_id email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/myPosts", authentication, async (req, res) => {
  try {
    const mypost = await Post.find({ postedBy: req.user.id }).populate(
      "postedBy",
      "_id email"
    );
    res.json(mypost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
