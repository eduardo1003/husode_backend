const express = require('express');
const router = express.Router();
const { Directive } = require('../models');
const authMiddleware = require('../middlewares/auth');
const { upload, cloudinary } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const members = await Directive.findAll({ order: [['order', 'ASC']] });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching board members' });
  }
});

// Create using multer single file upload 'photo'
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { name, role, email, order } = req.body;
    let photo = '';
    let public_id = '';
    
    if (req.file) {
      photo = req.file.path;
      public_id = req.file.filename;
    }
    
    const member = await Directive.create({ name, role, email, order, photo, public_id });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error creating board member' });
  }
});

// Update
router.put('/:id', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const member = await Directive.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    
    const { name, role, email, order } = req.body;
    
    if (req.file) {
      // User uploaded a new photo. We must delete the old one from Cloudinary.
      if (member.public_id) {
        await cloudinary.uploader.destroy(member.public_id);
      }
      
      member.photo = req.file.path;
      member.public_id = req.file.filename;
    }
    
    member.name = name || member.name;
    member.role = role || member.role;
    member.email = email || member.email;
    member.order = order || member.order;
    
    await member.save();
    res.json(member);
  } catch (error) {
    console.error('Update Directive Error:', error);
    res.status(500).json({ message: 'Error updating member' });
  }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Directive.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    
    // Delete from cloudinary
    if (member.public_id) {
      await cloudinary.uploader.destroy(member.public_id);
    }
    
    await member.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting member' });
  }
});

module.exports = router;
