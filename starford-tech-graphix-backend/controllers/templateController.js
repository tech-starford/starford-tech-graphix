console.log('templateController.js is being loaded');
const db = require('../db');

// Get all templates with filtering, sorting, pagination
const getTemplates = async (req, res) => {
  const { category, subcategory, orientation, sort, page = 1, limit = 12, search } = req.query;
  const offset = (page - 1) * limit;

  let baseQuery = 'SELECT * FROM templates WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (category) {
    baseQuery += ` AND category = $${paramIndex++}`;
    params.push(category);
  }
  if (subcategory) {
    baseQuery += ` AND subcategory = $${paramIndex++}`;
    params.push(subcategory);
  }
  if (orientation) {
    baseQuery += ` AND orientation = $${paramIndex++}`;
    params.push(orientation);
  }
  if (search) {
    baseQuery += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR $${paramIndex} = ANY(tags))`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Sorting
  let orderClause = 'ORDER BY created_at DESC'; // default newest
  if (sort === 'popular') orderClause = 'ORDER BY likes_count DESC';
  else if (sort === 'downloads') orderClause = 'ORDER BY downloads_count DESC';
  else if (sort === 'az') orderClause = 'ORDER BY title ASC';
  else if (sort === 'za') orderClause = 'ORDER BY title DESC';

  const query = `${baseQuery} ${orderClause} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  try {
    const result = await db.query(query, params);
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM templates WHERE 1=1';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = $1';
      countParams.push(category);
    }
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single template by ID
const getTemplateById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM templates WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get popular templates (e.g., most liked/downloaded)
const getPopular = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM templates ORDER BY likes_count DESC, downloads_count DESC LIMIT 12'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export all functions
module.exports = {
  getTemplates,
  getTemplateById,
  getPopular,
};