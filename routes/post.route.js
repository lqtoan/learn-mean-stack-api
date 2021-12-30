const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');

const Post = require('../models/post.model');

// @route GET /api/posts
// desc Get a new post
// @access private
// verifyToken,user: req.userId
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('user', 'username')
      .sort({ _id: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST /api/posts
// desc Create a new post
// @access private
// verifyToken
router.post('/', verifyToken, async (req, res) => {
  const { title, description, createdAt } = req.body;

  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });

  try {
    const newPost = new Post({
      title,
      description,
      createdAt,
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: 'Success!', post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
// verifyToken
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorised or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorised',
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
