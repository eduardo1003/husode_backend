const express = require('express');
const router = express.Router();
const { Event, Image, Video } = require('../models');
const authMiddleware = require('../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['date', 'DESC']], include: [Image, Video] });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const ev = await Event.create(req.body);
    res.status(201).json(ev);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });
    await ev.update(req.body);
    res.json(ev);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });
    await ev.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

module.exports = router;
