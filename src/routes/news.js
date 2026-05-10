const express = require('express');
const router = express.Router();
const { News, Image } = require('../models');
const authMiddleware = require('../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const news = await News.findAll({ order: [['createdAt', 'DESC']], include: [Image] });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newsItem = await News.create(req.body);
    res.status(201).json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const newsItem = await News.findByPk(req.params.id);
    if (!newsItem) return res.status(404).json({ message: 'Not found' });
    await newsItem.update(req.body);
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const newsItem = await News.findByPk(req.params.id);
    if (!newsItem) return res.status(404).json({ message: 'Not found' });
    await newsItem.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
});

module.exports = router;
