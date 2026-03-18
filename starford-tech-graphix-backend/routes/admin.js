const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require authentication + admin
router.use(authMiddleware, adminMiddleware);

// GET all templates (admin sees all, optionally with pagination)
router.get('/templates', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM templates ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new template
router.post('/templates', async (req, res) => {
  const {
    title, subtitle, description, category, subcategory,
    image_url, full_image_url, download_url,
    file_formats, dimensions, software, print_ready,
    color_mode, file_size, orientation, paper_size,
    tags, design_details, materials_specs, design_inspiration,
    practical_applications, features, colors,
    likes_count, downloads_count, favorites_count,
    shares_count, bookmarks_count
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO templates (
        title, subtitle, description, category, subcategory,
        image_url, full_image_url, download_url,
        file_formats, dimensions, software, print_ready,
        color_mode, file_size, orientation, paper_size,
        tags, design_details, materials_specs, design_inspiration,
        practical_applications, features, colors,
        likes_count, downloads_count, favorites_count,
        shares_count, bookmarks_count
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)
      RETURNING *
    `, [
      title, subtitle, description, category, subcategory,
      image_url, full_image_url, download_url,
      file_formats, dimensions, software, print_ready,
      color_mode, file_size, orientation, paper_size,
      tags, design_details, materials_specs, design_inspiration,
      practical_applications, features, colors,
      likes_count, downloads_count, favorites_count,
      shares_count, bookmarks_count
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT (update) a template
router.put('/templates/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  // Build dynamic update query (you can also write a full update with all fields)
  const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
  const values = [id, ...Object.values(fields)];

  try {
    const result = await db.query(
      `UPDATE templates SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Template not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a template
router.delete('/templates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM templates WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Template not found' });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;