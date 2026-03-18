const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const {
  toggleLike,
  toggleFavorite,
  toggleBookmark,
  download,
  share
} = require('../controllers/interactionController');

const router = express.Router();
 
// All these routes require authentication
router.post('/like/:templateId', authMiddleware, toggleLike);
router.post('/favorite/:templateId', authMiddleware, toggleFavorite);
router.post('/bookmark/:templateId', authMiddleware, toggleBookmark);
router.post('/download/:templateId', authMiddleware, download);
router.post('/share/:templateId', authMiddleware, share);

// Get user's liked templates
router.get('/likes', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT template_id FROM user_likes WHERE user_id = $1', [req.userId]);
    res.json(result.rows.map(r => r.template_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's favorited templates
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT template_id FROM user_favorites WHERE user_id = $1', [req.userId]);
    res.json(result.rows.map(r => r.template_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's bookmarked templates
router.get('/bookmarks', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT template_id FROM user_bookmarks WHERE user_id = $1', [req.userId]);
    res.json(result.rows.map(r => r.template_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get liked templates with details
router.get('/likes/details', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT t.* FROM templates t
            JOIN user_likes ul ON t.id = ul.template_id
            WHERE ul.user_id = $1
        `, [req.userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Similarly for favorites, bookmarks, and downloads (downloads might need a downloads table with user_id)

module.exports = router;