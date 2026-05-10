const express = require('express');
const router = express.Router();
const { Project, Image, Video } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['date', 'DESC']],
      include: [Image, Video]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, { include: [Image, Video] });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.destroy(); // Cascade will delete related images and videos in DB
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;
