const express = require('express');
const router = express.Router();
const { Config } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Get all configs (some public, but we can just send all if safe)
router.get('/', async (req, res) => {
  try {
    const configs = await Config.findAll();
    const configMap = {};
    configs.forEach(c => { configMap[c.key] = c.value; });
    res.json(configMap);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching config' });
  }
});

// Update or Create Config (Admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = req.body; 
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        await Config.upsert({ key, value: String(value) });
      }
    }
    res.json({ message: 'Configuration saved' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving config' });
  }
});

// Generic Config Upload Route (Logo, Institutional Image, etc.)
const { upload, cloudinary } = require('../config/cloudinary');
router.post('/upload/:key', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { key } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Try to get old public_id to delete it from Cloudinary
    const oldPublicId = await Config.findByPk(`${key}PublicId`);
    if (oldPublicId && oldPublicId.value) {
        await cloudinary.uploader.destroy(oldPublicId.value);
    }

    // Save new record
    await Config.upsert({ key: key, value: req.file.path });
    await Config.upsert({ key: `${key}PublicId`, value: req.file.filename });

    res.json({ url: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

module.exports = router;
