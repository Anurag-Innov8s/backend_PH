import express from "express";
const router = express.Router();
import authentication from "../middleware/authentication";
import { Post } from "../models/createPost";
router.post("/post", authentication, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) {
      throw new Error("Please fill all the fields.");
    } else {
      const post = await Post.create({
        body,
        photo: "pic",
        postedBy: req.user,
      });
      res.status(200).json({ post });
    }
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});
export default router;
