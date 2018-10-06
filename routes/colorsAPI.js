const express = require('express');
const router = express.Router();
const colors = require('./queries');

router.get('/api/v1/projects', colors.getAllProjects);
router.get('/api/v1/:project_id/palettes', colors.getProjectPalettes);
router.get('/api/v1/colors/:color_id', colors.getColor);
router.post('/api/v1/colors', colors.addColor);
router.post('/api/v1/projects', colors.addProject);
router.post('/api/v1/:project_id/palettes', colors.addPalette);
router.delete('/api/v1/palettes/:palette_id', colors.deletePalette);
router.delete('/api/v1/projects/:project_id', colors.deleteProject);

module.exports = router;