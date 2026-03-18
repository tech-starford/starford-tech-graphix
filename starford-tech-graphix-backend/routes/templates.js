const express = require('express');
const templateController = require('../controllers/templateController');

console.log('templateController object:', templateController);

const { getTemplates, getTemplateById, getPopular } = templateController;

console.log('Destructured functions:', { getTemplates, getTemplateById, getPopular });

const router = express.Router();

router.get('/', getTemplates);
router.get('/popular', getPopular);
router.get('/:id', getTemplateById);

module.exports = router;