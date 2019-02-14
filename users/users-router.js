const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

// Custom Middleware for POST and PUT only
function upperCaseName(req, res, next) {
  req.body.name = req.body.name.toUpperCase();
  next();
}

router.get('/', async (req, res) => {
  try {
    const users = await Users.get();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users." })
  }
})

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.getById(userId);
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ error: "User not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user." })
  }
});

router.get('/:id/posts', async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const posts = await Posts.get()
    const filtered = posts.filter(post => post.user_id === userId)
    res.status(200).json(filtered)
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts." })
  }
});

router.post('/', upperCaseName, async (req, res) => {
  const newUser = req.body;
  if (!newUser.name) {
    res.status(400).json({ error: "Include name when creating user." })
  }
  try {
    const user = await Users.insert(newUser);
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: "Error creating user." })
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await Users.getUserPosts(userId)
    if (!posts.length) {
      const count = await Users.remove(userId);
      if (count > 0) {
        res.send(204).end()
        // res.json({ message: `User ${userId} deleted sucessfully ` })
      } else {
        res.status(404).json({ error: 'The user could not be found' });
      }
    } else {
      res.status(403).json({ error: "Can't delete user with posts."})
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting user." })
  }
});

router.put('/:id', upperCaseName, async (req, res) => {
  const userId = req.params.id;
  const changes = req.body;

  try {
    const count = await Users.update(userId, changes);
    if (count > 0) {
      const user = await Users.getById(userId)
      res.status(200).json(user)
    } else {
      res.status(404).json({ error: "User not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating user." })
  }
});

module.exports = router;