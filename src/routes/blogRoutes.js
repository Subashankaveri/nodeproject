const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Fetch all posts
router.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.render('index', { posts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Form for adding a new post
router.get('/add-post', (req, res) => {
  res.render('postForm');
});

// Add a new post
router.post('/add-post', async (req, res) => {
  const { title, content } = req.body;
  try {
    await pool.query('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
