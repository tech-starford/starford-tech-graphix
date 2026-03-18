const db = require('../db');

// Toggle like (authenticated)
const toggleLike = async (req, res) => {
  const userId = req.userId;
  const templateId = req.params.templateId;

  try {
    const existing = await db.query(
      'SELECT * FROM user_likes WHERE user_id = $1 AND template_id = $2',
      [userId, templateId]
    );

    if (existing.rows.length > 0) {
      await db.query('DELETE FROM user_likes WHERE user_id = $1 AND template_id = $2', [userId, templateId]);
      await db.query('UPDATE templates SET likes_count = likes_count - 1 WHERE id = $1', [templateId]);
    } else {
      await db.query('INSERT INTO user_likes (user_id, template_id) VALUES ($1, $2)', [userId, templateId]);
      await db.query('UPDATE templates SET likes_count = likes_count + 1 WHERE id = $1', [templateId]);
    }

    const template = await db.query('SELECT likes_count FROM templates WHERE id = $1', [templateId]);
    res.json({ liked: existing.rows.length === 0, likes_count: template.rows[0].likes_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle favorite (authenticated)
const toggleFavorite = async (req, res) => {
  const userId = req.userId;
  const templateId = req.params.templateId;

  try {
    const existing = await db.query(
      'SELECT * FROM user_favorites WHERE user_id = $1 AND template_id = $2',
      [userId, templateId]
    );

    if (existing.rows.length > 0) {
      await db.query('DELETE FROM user_favorites WHERE user_id = $1 AND template_id = $2', [userId, templateId]);
      await db.query('UPDATE templates SET favorites_count = favorites_count - 1 WHERE id = $1', [templateId]);
    } else {
      await db.query('INSERT INTO user_favorites (user_id, template_id) VALUES ($1, $2)', [userId, templateId]);
      await db.query('UPDATE templates SET favorites_count = favorites_count + 1 WHERE id = $1', [templateId]);
    }

    const template = await db.query('SELECT favorites_count FROM templates WHERE id = $1', [templateId]);
    res.json({ favorited: existing.rows.length === 0, favorites_count: template.rows[0].favorites_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle bookmark (authenticated)
const toggleBookmark = async (req, res) => {
  const userId = req.userId;
  const templateId = req.params.templateId;

  try {
    const existing = await db.query(
      'SELECT * FROM user_bookmarks WHERE user_id = $1 AND template_id = $2',
      [userId, templateId]
    );

    if (existing.rows.length > 0) {
      await db.query('DELETE FROM user_bookmarks WHERE user_id = $1 AND template_id = $2', [userId, templateId]);
      await db.query('UPDATE templates SET bookmarks_count = bookmarks_count - 1 WHERE id = $1', [templateId]);
    } else {
      await db.query('INSERT INTO user_bookmarks (user_id, template_id) VALUES ($1, $2)', [userId, templateId]);
      await db.query('UPDATE templates SET bookmarks_count = bookmarks_count + 1 WHERE id = $1', [templateId]);
    }

    const template = await db.query('SELECT bookmarks_count FROM templates WHERE id = $1', [templateId]);
    res.json({ bookmarked: existing.rows.length === 0, bookmarks_count: template.rows[0].bookmarks_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download (optional auth)
const download = async (req, res) => {
  const userId = req.userId || null;
  const templateId = req.params.templateId;
  const ip = req.ip;

  try {
    await db.query(
      'INSERT INTO downloads (user_id, template_id, ip_address) VALUES ($1, $2, $3)',
      [userId, templateId, ip]
    );
    const result = await db.query(
      'UPDATE templates SET downloads_count = downloads_count + 1 WHERE id = $1 RETURNING downloads_count',
      [templateId]
    );
    const template = await db.query('SELECT download_url FROM templates WHERE id = $1', [templateId]);
    res.json({ 
      download_url: template.rows[0].download_url,
      downloads_count: result.rows[0].downloads_count 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Share (optional auth)
const share = async (req, res) => {
  const userId = req.userId || null;
  const templateId = req.params.templateId;

  try {
    await db.query('INSERT INTO shares (user_id, template_id) VALUES ($1, $2)', [userId, templateId]);
    await db.query('UPDATE templates SET shares_count = shares_count + 1 WHERE id = $1', [templateId]);
    res.json({ message: 'Share counted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export all functions
module.exports = {
  toggleLike,
  toggleFavorite,
  toggleBookmark,
  download,
  share
};