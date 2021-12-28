const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');

const Post = require('../models/post.model');

// @route GET /api/posts
// desc Get a new post
// @access private
// verifyToken
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId })
      .populate('user', ['username'])
      .sort({ _id: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
  }
});

// @route POST /api/posts
// desc Create a new post
// @access private
// verifyToken
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });

  try {
    const newPost = new Post({
      title,
      description,
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: 'Success!', post: newPost });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
