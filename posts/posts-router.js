const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get();
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: "Posts could not be retrieved." })
  }
})

router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Posts.getById(postId);
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ error: "Post could not be retrieved." })
  }
});

router.post('/', async (req, res) => {
  // How to retrieve userId? from client or server?
  // const user_id = req.params.id;
  const newPost = req.body;

  try {
    const post = await Posts.insert(newPost);
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: "Post could not be created." })
  }
});

router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const count = await Posts.remove(postId)
    if (count > 0) {
      res.status(204).end()
    } else {
      res.status(404).json({ error: "Post could not be found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Post could not be deleted." })
  }
});

router.put('/:id', async (req, res) => {
  const postId = req.params.id;
  const changes = req.body;
  try {
    const count = await Posts.update(postId, changes)
    if (count > 0) {
      const post = await Posts.getById(postId);
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post could not be found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Post could not be updated." })
  }
});

module.exports = router;