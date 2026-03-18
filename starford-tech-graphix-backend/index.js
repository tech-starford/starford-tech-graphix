const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./db');

const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const interactionRoutes = require('./routes/interactions');
const newsletterRoutes = require('./routes/newsletter');
const adminRoutes = require('./routes/admin');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);


//test route to check database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Database connected', time: result.rows[0].now });
  } catch (err) {
    console.error('❌ Database connection error:', err);  // <-- add this
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// get template by ID
const getTemplateById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM templates WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Template not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get popular templates
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

