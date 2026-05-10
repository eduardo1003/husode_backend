const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Public route to submit contact
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: 'Message received', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting message' });
  }
});

// Admin routes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Not found' });
    await contact.update(req.body);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Not found' });
    await contact.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

module.exports = router;
