const express = require('express');
const router = express.Router();
const colors = require('./queries');

router.get('/', colors.getAllProjects);
router.get('/colors', colors.getAllColors);
router.post('/colors/new', colors.addColor);
router.post('/projects/new', colors.addProject);
router.post('/:project_id/palettes/new', colors.addPalette);
router.get('/:project_id/palettes', colors.getProjectPalettes);
router.delete('/:project_id/palettes/:palette_id', colors.deletePalette);
router.delete('/:project_id', colors.deleteProject);

module.exports = router;