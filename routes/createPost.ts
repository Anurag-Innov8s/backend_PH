import express from "express";
const router = express.Router();
import authentication from "../middleware/authentication";
import { Post } from "../models/createPost";
router.post("/post", authentication, async (req, res) => {
  const { body } = req.body;
  if (!body) {
    res.status(400).json({
      error: "please add all the fields",
    });
    return;
  } else {
    console.log(req.user);
    const post = await Post.create({
      body,
      photo: "pic",
      postedBy: req.user,
    });
    res.status(200).json({ post });
  }
});
export default router;
